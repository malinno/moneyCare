import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Budget, CreateBudgetData } from '@types/index';
import { budgetService } from '@services/api/budgetService';

interface BudgetState {
  budgets: Budget[];
  currentBudget: Budget | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  budgets: [],
  currentBudget: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchBudgets = createAsyncThunk(
  'budgets/fetchBudgets',
  async (_, { rejectWithValue }) => {
    try {
      const budgets = await budgetService.getBudgets();
      return budgets;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch budgets');
    }
  }
);

export const fetchBudgetById = createAsyncThunk(
  'budgets/fetchBudgetById',
  async (id: string, { rejectWithValue }) => {
    try {
      const budget = await budgetService.getBudgetById(id);
      return budget;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch budget');
    }
  }
);

export const createBudget = createAsyncThunk(
  'budgets/createBudget',
  async (data: CreateBudgetData, { rejectWithValue }) => {
    try {
      const budget = await budgetService.createBudget(data);
      return budget;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create budget');
    }
  }
);

export const updateBudget = createAsyncThunk(
  'budgets/updateBudget',
  async ({ id, data }: { id: string; data: Partial<CreateBudgetData> }, { rejectWithValue }) => {
    try {
      const budget = await budgetService.updateBudget(id, data);
      return budget;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update budget');
    }
  }
);

export const deleteBudget = createAsyncThunk(
  'budgets/deleteBudget',
  async (id: string, { rejectWithValue }) => {
    try {
      await budgetService.deleteBudget(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete budget');
    }
  }
);

// Budget slice
const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentBudget: (state, action: PayloadAction<Budget | null>) => {
      state.currentBudget = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Budgets
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.budgets = action.payload;
        state.error = null;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Budget by ID
    builder
      .addCase(fetchBudgetById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBudgetById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBudget = action.payload;
        state.error = null;
      })
      .addCase(fetchBudgetById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Budget
    builder
      .addCase(createBudget.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        state.budgets = [action.payload, ...state.budgets];
        state.error = null;
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Budget
    builder
      .addCase(updateBudget.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedBudget = action.payload;
        const index = state.budgets.findIndex(b => b.id === updatedBudget.id);
        
        if (index !== -1) {
          state.budgets[index] = updatedBudget;
        }
        
        if (state.currentBudget?.id === updatedBudget.id) {
          state.currentBudget = updatedBudget;
        }
        
        state.error = null;
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete Budget
    builder
      .addCase(deleteBudget.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.payload;
        state.budgets = state.budgets.filter(b => b.id !== deletedId);
        
        if (state.currentBudget?.id === deletedId) {
          state.currentBudget = null;
        }
        
        state.error = null;
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentBudget } = budgetSlice.actions;
export default budgetSlice.reducer;
