import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCreateSpendingLimit } from '../../hooks/api/useSpendingLimits';
import { useCategories } from '../../hooks/api/useCategories';
import { SuccessModal } from '../../components/common/SuccessModal';

const { width } = Dimensions.get('window');

export const CreateSpendingLimitScreen: React.FC = () => {
  const navigation = useNavigation();
  const createSpendingLimitMutation = useCreateSpendingLimit();
  const { data: categories = [] } = useCategories();
  
  const [formData, setFormData] = useState({
    categoryId: '',
    limit: '',
    period: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
  });
  
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    categoryId: false,
    limit: false,
  });

  const periods = [
    { value: 'weekly', label: 'Hàng tuần' },
    { value: 'monthly', label: 'Hàng tháng' },
    { value: 'yearly', label: 'Hàng năm' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleFormSubmit = async () => {
    let hasErrors = false;
    const newValidationErrors = {
      categoryId: false,
      limit: false,
    };

    // Validate category
    if (!formData.categoryId) {
      newValidationErrors.categoryId = true;
      hasErrors = true;
    }

    // Validate limit
    const numericLimit = formData.limit.replace(/\./g, '');
    if (!numericLimit || isNaN(Number(numericLimit)) || Number(numericLimit) <= 0) {
      newValidationErrors.limit = true;
      hasErrors = true;
    }

    setValidationErrors(newValidationErrors);

    if (hasErrors) {
      return;
    }

    try {
      const spendingLimitData = {
        categoryId: formData.categoryId,
        limit: Number(numericLimit),
        period: formData.period,
        startDate: formData.startDate,
        endDate: formData.endDate,
      };

      await createSpendingLimitMutation.mutateAsync(spendingLimitData);
      
      // Show success modal
      setIsSuccessModalVisible(true);
      
      // Navigate back after 2 seconds
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tạo hạn mức chi tiêu. Vui lòng thử lại.");
    }
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalVisible(false);
  };

  const formatCurrency = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleLimitChange = (text: string) => {
    const formatted = formatCurrency(text);
    handleInputChange('limit', formatted);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo hạn mức chi tiêu</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Category Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Danh mục *</Text>
          <View style={[
            styles.categoryContainer,
            validationErrors.categoryId && styles.errorBorder
          ]}>
            <Text style={[
              styles.categoryText,
              validationErrors.categoryId && styles.errorText
            ]}>
              {formData.categoryId ? 
                categories.find(cat => cat._id === formData.categoryId)?.name || 'Chọn danh mục' :
                'Chọn danh mục'
              }
            </Text>
            <Text style={styles.categoryChevron}>▼</Text>
          </View>
          {validationErrors.categoryId && (
            <Text style={styles.validationText}>Vui lòng chọn danh mục</Text>
          )}
        </View>

        {/* Limit Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Hạn mức (₫) *</Text>
          <View style={[
            styles.limitContainer,
            validationErrors.limit && styles.errorBorder
          ]}>
            <TextInput
              style={styles.limitInput}
              placeholder="Nhập hạn mức"
              placeholderTextColor="#9CA3AF"
              value={formData.limit ? `${formData.limit} ₫` : ''}
              onChangeText={handleLimitChange}
              keyboardType="numeric"
            />
          </View>
          {validationErrors.limit && (
            <Text style={styles.validationText}>Vui lòng nhập hạn mức hợp lệ</Text>
          )}
        </View>

        {/* Period Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Chu kỳ</Text>
          <View style={styles.periodContainer}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period.value}
                style={[
                  styles.periodOption,
                  formData.period === period.value && styles.selectedPeriodOption
                ]}
                onPress={() => handleInputChange('period', period.value)}
              >
                <Text style={[
                  styles.periodOptionText,
                  formData.period === period.value && styles.selectedPeriodOptionText
                ]}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date Range */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Thời gian áp dụng</Text>
          <View style={styles.dateRangeContainer}>
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateLabel}>Từ ngày</Text>
              <TextInput
                style={styles.dateInput}
                value={formData.startDate}
                onChangeText={(text) => handleInputChange('startDate', text)}
                placeholder="YYYY-MM-DD"
              />
            </View>
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateLabel}>Đến ngày</Text>
              <TextInput
                style={styles.dateInput}
                value={formData.endDate}
                onChangeText={(text) => handleInputChange('endDate', text)}
                placeholder="YYYY-MM-DD"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.createButton,
            createSpendingLimitMutation.isPending && styles.createButtonDisabled
          ]}
          onPress={handleFormSubmit}
          disabled={createSpendingLimitMutation.isPending}
        >
          <Text style={styles.createButtonText}>
            {createSpendingLimitMutation.isPending ? 'Đang tạo...' : 'Tạo hạn mức'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <SuccessModal
        visible={isSuccessModalVisible}
        onClose={handleSuccessModalClose}
        message="Tạo hạn mức chi tiêu thành công"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  categoryChevron: {
    fontSize: 16,
    color: '#6B7280',
  },
  limitContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  limitInput: {
    fontSize: 16,
    color: '#1F2937',
  },
  periodContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  periodOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  selectedPeriodOption: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  periodOptionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  selectedPeriodOptionText: {
    color: '#FFFFFF',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInputContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  dateInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    color: '#1F2937',
  },
  bottomContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  createButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  errorBorder: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  errorText: {
    color: '#EF4444',
  },
  validationText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 4,
  },
});



