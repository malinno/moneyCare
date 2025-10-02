import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { Card, LoadingSpinner } from '@components/common';
import { useTheme } from '@contexts/ThemeContext';
import { useAuth } from '@contexts/AuthContext';
import { RootState, AppDispatch } from '@store/index';
import { fetchTransactions } from '@store/slices/transactionSlice';
import { fetchBudgets } from '@store/slices/budgetSlice';
import { setRefreshing } from '@store/slices/uiSlice';
import { SPACING, TYPOGRAPHY } from '@constants/theme';
import { formatCurrency, formatDate } from '@utils/index';

export const HomeScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const { transactions, isLoading: transactionsLoading } = useSelector((state: RootState) => state.transactions);
  const { budgets, isLoading: budgetsLoading } = useSelector((state: RootState) => state.budgets);
  const { refreshing } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        dispatch(fetchTransactions({ page: 1, limit: 5 })),
        dispatch(fetchBudgets()),
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleRefresh = async () => {
    dispatch(setRefreshing(true));
    await loadData();
    dispatch(setRefreshing(false));
  };

  const calculateTotalBalance = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return income - expense;
  };

  const getMonthlyStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expense };
  };

  const recentTransactions = transactions.slice(0, 5);
  const activeBudgets = budgets.filter(b => b.isActive).slice(0, 3);
  const { income: monthlyIncome, expense: monthlyExpense } = getMonthlyStats();

  if (transactionsLoading && transactions.length === 0) {
    return <LoadingSpinner text="Đang tải dữ liệu..." />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[theme.colors.primary[500]]}
        />
      }
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary[500] }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.white }]}>
              Xin chào, {user?.firstName}!
            </Text>
            <Text style={[styles.date, { color: theme.colors.primary[100] }]}>
              {formatDate(new Date(), 'long')}
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <Card style={[styles.balanceCard, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.balanceLabel, { color: theme.colors.text.secondary }]}>
            Tổng số dư
          </Text>
          <Text style={[styles.balanceAmount, { color: theme.colors.text.primary }]}>
            {formatCurrency(calculateTotalBalance())}
          </Text>
          
          <View style={styles.balanceStats}>
            <View style={styles.statItem}>
              <Ionicons name="arrow-up" size={16} color={theme.colors.action.lima} />
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                Thu nhập
              </Text>
              <Text style={[styles.statAmount, { color: theme.colors.action.lima }]}>
                {formatCurrency(monthlyIncome)}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="arrow-down" size={16} color={theme.colors.action.coralRed} />
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                Chi tiêu
              </Text>
              <Text style={[styles.statAmount, { color: theme.colors.action.coralRed }]}>
                {formatCurrency(monthlyExpense)}
              </Text>
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.content}>
        {/* Quick Actions */}
        <Card style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Thao tác nhanh
          </Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: `${theme.colors.action.lima}15` }]}>
              <Ionicons name="add" size={24} color={theme.colors.action.lima} />
              <Text style={[styles.actionText, { color: theme.colors.action.lima }]}>
                Thu nhập
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: `${theme.colors.action.coralRed}15` }]}>
              <Ionicons name="remove" size={24} color={theme.colors.action.coralRed} />
              <Text style={[styles.actionText, { color: theme.colors.action.coralRed }]}>
                Chi tiêu
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: `${theme.colors.action.azureRadiance}15` }]}>
              <Ionicons name="swap-horizontal" size={24} color={theme.colors.action.azureRadiance} />
              <Text style={[styles.actionText, { color: theme.colors.action.azureRadiance }]}>
                Chuyển tiền
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Recent Transactions */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Giao dịch gần đây
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: theme.colors.primary[500] }]}>
                Xem tất cả
              </Text>
            </TouchableOpacity>
          </View>
          
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={[
                  styles.transactionIcon,
                  { backgroundColor: transaction.type === 'income' 
                    ? `${theme.colors.action.lima}20` 
                    : `${theme.colors.action.coralRed}20` 
                  }
                ]}>
                  <Ionicons
                    name={transaction.type === 'income' ? 'arrow-up' : 'arrow-down'}
                    size={20}
                    color={transaction.type === 'income' 
                      ? theme.colors.action.lima 
                      : theme.colors.action.coralRed
                    }
                  />
                </View>
                
                <View style={styles.transactionDetails}>
                  <Text style={[styles.transactionCategory, { color: theme.colors.text.primary }]}>
                    {transaction.categoryName}
                  </Text>
                  <Text style={[styles.transactionDate, { color: theme.colors.text.secondary }]}>
                    {formatDate(transaction.date)}
                  </Text>
                </View>
                
                <Text style={[
                  styles.transactionAmount,
                  { color: transaction.type === 'income' 
                    ? theme.colors.action.lima 
                    : theme.colors.action.coralRed 
                  }
                ]}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
              Chưa có giao dịch nào
            </Text>
          )}
        </Card>

        {/* Active Budgets */}
        {activeBudgets.length > 0 && (
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                Ngân sách đang hoạt động
              </Text>
              <TouchableOpacity>
                <Text style={[styles.seeAll, { color: theme.colors.primary[600] }]}>
                  Xem tất cả
                </Text>
              </TouchableOpacity>
            </View>
            
            {activeBudgets.map((budget) => {
              const percentage = (budget.spent / budget.amount) * 100;
              const isOverBudget = percentage > 100;
              
              return (
                <View key={budget.id} style={styles.budgetItem}>
                  <View style={styles.budgetHeader}>
                    <Text style={[styles.budgetName, { color: theme.colors.text.primary }]}>
                      {budget.name}
                    </Text>
                    <Text style={[styles.budgetAmount, { color: theme.colors.text.secondary }]}>
                      {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                    </Text>
                  </View>
                  
                  <View style={[styles.progressBar, { backgroundColor: theme.colors.gray[200] }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: isOverBudget 
                            ? theme.colors.error[600] 
                            : percentage > 80 
                            ? theme.colors.warning[600]
                            : theme.colors.primary[600]
                        }
                      ]}
                    />
                  </View>
                  
                  <Text style={[
                    styles.budgetPercentage,
                    { color: isOverBudget ? theme.colors.error[600] : theme.colors.text.secondary }
                  ]}>
                    {percentage.toFixed(1)}% đã sử dụng
                  </Text>
                </View>
              );
            })}
          </Card>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: SPACING['3xl'],
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  greeting: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  date: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginTop: SPACING.xs,
  },
  notificationButton: {
    padding: SPACING.sm,
  },
  balanceCard: {
    marginHorizontal: -SPACING.lg,
    marginBottom: -SPACING.lg,
  },
  balanceLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginBottom: SPACING.xs,
  },
  balanceAmount: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginBottom: SPACING.lg,
  },
  balanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    marginTop: SPACING.xs,
  },
  statAmount: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginTop: SPACING.xs,
  },
  content: {
    padding: SPACING.lg,
  },
  quickActions: {
    marginBottom: SPACING.lg,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: 12,
    marginHorizontal: SPACING.xs,
  },
  actionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginTop: SPACING.xs,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  seeAll: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionCategory: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  transactionDate: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginTop: SPACING.xs,
  },
  transactionAmount: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: TYPOGRAPHY.fontSize.base,
    padding: SPACING.xl,
  },
  budgetItem: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  budgetName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  budgetAmount: {
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: SPACING.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  budgetPercentage: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    textAlign: 'right',
  },
});
