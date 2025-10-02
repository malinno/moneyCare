import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isLoading: boolean;
  activeTab: string;
  modalVisible: boolean;
  modalType: string | null;
  modalData: any;
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'warning' | 'info' | null;
  refreshing: boolean;
  networkStatus: 'online' | 'offline';
}

const initialState: UIState = {
  isLoading: false,
  activeTab: 'Home',
  modalVisible: false,
  modalType: null,
  modalData: null,
  toastMessage: null,
  toastType: null,
  refreshing: false,
  networkStatus: 'online',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    showModal: (state, action: PayloadAction<{ type: string; data?: any }>) => {
      state.modalVisible = true;
      state.modalType = action.payload.type;
      state.modalData = action.payload.data || null;
    },
    hideModal: (state) => {
      state.modalVisible = false;
      state.modalType = null;
      state.modalData = null;
    },
    showToast: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'warning' | 'info' }>) => {
      state.toastMessage = action.payload.message;
      state.toastType = action.payload.type;
    },
    hideToast: (state) => {
      state.toastMessage = null;
      state.toastType = null;
    },
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.refreshing = action.payload;
    },
    setNetworkStatus: (state, action: PayloadAction<'online' | 'offline'>) => {
      state.networkStatus = action.payload;
    },
  },
});

export const {
  setLoading,
  setActiveTab,
  showModal,
  hideModal,
  showToast,
  hideToast,
  setRefreshing,
  setNetworkStatus,
} = uiSlice.actions;

export default uiSlice.reducer;
