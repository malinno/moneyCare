import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Account } from '@types/index';
import { accountService } from '@services/api/accountService';

interface AccountState {
  accounts: Account[];
  currentAccount: Account | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  accounts: [],
  currentAccount: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchAccounts = createAsyncThunk(
  'accounts/fetchAccounts',
  async (_, { rejectWithValue }) => {
    try {
      const accounts = await accountService.getAccounts();
      return accounts;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch accounts');
    }
  }
);

export const createAccount = createAsyncThunk(
  'accounts/createAccount',
  async (data: Omit<Account, 'id' | 'userId' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const account = await accountService.createAccount(data);
      return account;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create account');
    }
  }
);

export const updateAccount = createAsyncThunk(
  'accounts/updateAccount',
  async ({ id, data }: { id: string; data: Partial<Account> }, { rejectWithValue }) => {
    try {
      const account = await accountService.updateAccount(id, data);
      return account;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update account');
    }
  }
);

export const deleteAccount = createAsyncThunk(
  'accounts/deleteAccount',
  async (id: string, { rejectWithValue }) => {
    try {
      await accountService.deleteAccount(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete account');
    }
  }
);

// Account slice
const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentAccount: (state, action: PayloadAction<Account | null>) => {
      state.currentAccount = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Accounts
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accounts = action.payload;
        state.error = null;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Account
    builder
      .addCase(createAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accounts = [action.payload, ...state.accounts];
        state.error = null;
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Account
    builder
      .addCase(updateAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedAccount = action.payload;
        const index = state.accounts.findIndex(a => a.id === updatedAccount.id);
        
        if (index !== -1) {
          state.accounts[index] = updatedAccount;
        }
        
        if (state.currentAccount?.id === updatedAccount.id) {
          state.currentAccount = updatedAccount;
        }
        
        state.error = null;
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete Account
    builder
      .addCase(deleteAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.payload;
        state.accounts = state.accounts.filter(a => a.id !== deletedId);
        
        if (state.currentAccount?.id === deletedId) {
          state.currentAccount = null;
        }
        
        state.error = null;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentAccount } = accountSlice.actions;
export default accountSlice.reducer;
