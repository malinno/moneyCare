# React Query API Hooks

Hệ thống API hooks sử dụng TanStack React Query để quản lý data fetching, caching, và synchronization trong ứng dụng MoneyCare.

## Tổng quan

### ✅ **Đã triển khai Axios Interceptors**

- **Request Interceptor**: Tự động thêm JWT token vào headers
- **Response Interceptor**: Xử lý token refresh tự động
- **Error Handling**: Transform lỗi API thành format chuẩn
- **Token Management**: Quản lý access token và refresh token an toàn

### ✅ **React Query Integration**

- **Caching**: Tự động cache data với stale time và gc time
- **Background Updates**: Tự động refetch data khi cần
- **Optimistic Updates**: Cập nhật UI ngay lập tức
- **Error Retry**: Tự động retry với exponential backoff
- **Infinite Queries**: Hỗ trợ infinite scroll

## API Hooks Available

### 🔐 **Authentication Hooks (useAuth.ts)**

```tsx
import {
  useUser,
  useLogin,
  useRegister,
  useLogout,
  useUpdateProfile,
  useChangePassword,
} from "@hooks/api";

// Get current user
const { data: user, isLoading, error } = useUser();

// Login
const loginMutation = useLogin();
loginMutation.mutate({ email, password });

// Register
const registerMutation = useRegister();
registerMutation.mutate({ firstName, lastName, email, password });

// Logout
const logoutMutation = useLogout();
logoutMutation.mutate();
```

### 💰 **Transaction Hooks (useTransactions.ts)**

```tsx
import {
  useTransactions,
  useInfiniteTransactions,
  useTransaction,
  useRecentTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from "@hooks/api";

// Get transactions with pagination
const { data: transactions, isLoading } = useTransactions({
  page: 1,
  limit: 20,
  filters: { type: "expense" },
});

// Infinite scroll transactions
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useInfiniteTransactions({ type: "expense" });

// Get recent transactions
const { data: recent } = useRecentTransactions(10);

// Create transaction
const createMutation = useCreateTransaction();
createMutation.mutate({
  type: "expense",
  amount: 50000,
  categoryId: "food",
  description: "Lunch",
  date: new Date().toISOString(),
});

// Update transaction
const updateMutation = useUpdateTransaction();
updateMutation.mutate({
  id: "transaction-id",
  data: { amount: 60000 },
});
```

### 📊 **Budget Hooks (useBudgets.ts)**

```tsx
import {
  useBudgets,
  useBudget,
  useBudgetProgress,
  useActiveBudgets,
  useBudgetAlerts,
  useCreateBudget,
} from "@hooks/api";

// Get all budgets
const { data: budgets } = useBudgets();

// Get single budget with progress
const { data: budget } = useBudget("budget-id");
const { data: progress } = useBudgetProgress("budget-id");

// Get active budgets
const { data: activeBudgets } = useActiveBudgets();

// Get budget alerts
const { data: alerts } = useBudgetAlerts();

// Create budget
const createBudgetMutation = useCreateBudget();
createBudgetMutation.mutate({
  name: "Monthly Food Budget",
  amount: 2000000,
  period: "monthly",
  categoryIds: ["food", "restaurant"],
});
```

### 🏷️ **Category Hooks (useCategories.ts)**

```tsx
import {
  useCategories,
  useIncomeCategories,
  useExpenseCategories,
  useCategory,
  useCategoryStats,
  useCreateCategory,
} from "@hooks/api";

// Get all categories
const { data: categories } = useCategories();

// Get categories by type
const { data: incomeCategories } = useIncomeCategories();
const { data: expenseCategories } = useExpenseCategories();

// Get category stats
const { data: stats } = useCategoryStats({
  startDate: "2024-01-01",
  endDate: "2024-12-31",
  type: "expense",
});

// Create category
const createCategoryMutation = useCreateCategory();
createCategoryMutation.mutate({
  name: "Groceries",
  type: "expense",
  icon: "basket",
  color: "#FF6B6B",
});
```

### 🏦 **Account Hooks (useAccounts.ts)**

```tsx
import {
  useAccounts,
  useAccount,
  useAccountSummary,
  useAccountBalanceHistory,
  useCreateAccount,
  useTransferBetweenAccounts,
} from "@hooks/api";

// Get all accounts
const { data: accounts } = useAccounts();

// Get account summary
const { data: summary } = useAccountSummary();

// Get account balance history
const { data: balanceHistory } = useAccountBalanceHistory("account-id", {
  startDate: "2024-01-01",
  endDate: "2024-12-31",
  interval: "month",
});

// Create account
const createAccountMutation = useCreateAccount();
createAccountMutation.mutate({
  name: "Savings Account",
  type: "savings",
  initialBalance: 1000000,
  currency: "VND",
});

// Transfer between accounts
const transferMutation = useTransferBetweenAccounts();
transferMutation.mutate({
  fromAccountId: "account-1",
  toAccountId: "account-2",
  amount: 500000,
  description: "Monthly transfer",
});
```

## Query Keys Structure

```tsx
import { queryKeys } from "@config/queryClient";

// Structured query keys for better cache management
queryKeys.transactions.all; // ['transactions']
queryKeys.transactions.list(); // ['transactions', 'list']
queryKeys.transactions.detail(id); // ['transactions', 'detail', id]
queryKeys.budgets.progress(id); // ['budgets', 'progress', id]
queryKeys.categories.stats(params); // ['categories', 'stats', { params }]
```

## Cache Invalidation

```tsx
import { invalidateQueries } from "@config/queryClient";

// Invalidate specific queries after mutations
invalidateQueries.transactions(); // Invalidate all transaction queries
invalidateQueries.transaction(id); // Invalidate specific transaction
invalidateQueries.budgets(); // Invalidate all budget queries
invalidateQueries.all(); // Invalidate everything
```

## Error Handling

```tsx
const { data, error, isLoading, isError } = useTransactions();

if (isError) {
  console.error("API Error:", error.message);
  // error.status - HTTP status code
  // error.errors - Validation errors array
}
```

## Loading States

```tsx
const {
  data,
  isLoading, // Initial loading
  isFetching, // Background refetching
  isRefetching, // Manual refetch
  isPending, // For mutations
} = useTransactions();

// For mutations
const mutation = useCreateTransaction();
const isCreating = mutation.isPending;
const createError = mutation.error;
const isSuccess = mutation.isSuccess;
```

## Optimistic Updates

```tsx
const updateTransactionMutation = useUpdateTransaction();

// Optimistic update example
const handleUpdate = (id: string, newData: any) => {
  updateTransactionMutation.mutate(
    { id, data: newData },
    {
      onMutate: async (variables) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({
          queryKey: queryKeys.transactions.detail(id),
        });

        // Snapshot previous value
        const previousTransaction = queryClient.getQueryData(
          queryKeys.transactions.detail(id)
        );

        // Optimistically update
        queryClient.setQueryData(
          queryKeys.transactions.detail(id),
          (old: any) => ({ ...old, ...variables.data })
        );

        return { previousTransaction };
      },
      onError: (err, variables, context) => {
        // Rollback on error
        if (context?.previousTransaction) {
          queryClient.setQueryData(
            queryKeys.transactions.detail(id),
            context.previousTransaction
          );
        }
      },
      onSettled: () => {
        // Refetch after mutation
        queryClient.invalidateQueries({
          queryKey: queryKeys.transactions.detail(id),
        });
      },
    }
  );
};
```

## Infinite Queries

```tsx
const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
  useInfiniteTransactions();

// Render infinite list
const allTransactions = data?.pages.flatMap((page) => page.data) ?? [];

// Load more button
<Button
  title="Load More"
  onPress={() => fetchNextPage()}
  loading={isFetchingNextPage}
  disabled={!hasNextPage}
/>;
```

## Best Practices

### 1. **Query Key Management**

```tsx
// ✅ Good - Use structured query keys
queryKeys.transactions.list({ type: "expense" })[
  // ❌ Bad - Hardcoded strings
  ("transactions", "expense")
];
```

### 2. **Error Handling**

```tsx
// ✅ Good - Handle errors gracefully
const { data, error, isError } = useTransactions();

if (isError) {
  return <ErrorMessage error={error} />;
}
```

### 3. **Loading States**

```tsx
// ✅ Good - Show appropriate loading states
if (isLoading) return <LoadingSpinner />;
if (isFetching) return <RefreshIndicator />;
```

### 4. **Cache Invalidation**

```tsx
// ✅ Good - Invalidate related queries
const createMutation = useCreateTransaction();
createMutation.mutate(data, {
  onSuccess: () => {
    invalidateQueries.transactions();
    invalidateQueries.budgets(); // Related data
  },
});
```

### 5. **Stale Time Configuration**

```tsx
// ✅ Good - Configure appropriate stale times
const { data } = useTransactions({
  staleTime: 2 * 60 * 1000, // 2 minutes for frequently changing data
});

const { data: categories } = useCategories({
  staleTime: 10 * 60 * 1000, // 10 minutes for static data
});
```

## Configuration

### Query Client Setup

```tsx
// src/config/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3, // Retry 3 times
      refetchOnWindowFocus: false, // Don't refetch on focus
    },
  },
});
```

### Provider Setup

```tsx
// App.tsx
import { QueryProvider } from "@providers/QueryProvider";

export default function App() {
  return (
    <QueryProvider>
      <YourApp />
    </QueryProvider>
  );
}
```

## Example Usage

Xem file `useApiExample.tsx` để có ví dụ đầy đủ về cách sử dụng các API hooks trong một component thực tế.

## Features

### ✅ **Axios Interceptors**

- Automatic JWT token injection
- Token refresh handling
- Error transformation
- Request/response logging

### ✅ **React Query Integration**

- Intelligent caching
- Background updates
- Optimistic updates
- Error retry with backoff
- Infinite queries support

### ✅ **Type Safety**

- Full TypeScript support
- Typed query keys
- Typed API responses
- Generic hooks

### ✅ **Performance**

- Request deduplication
- Background refetching
- Stale-while-revalidate
- Memory management

### ✅ **Developer Experience**

- Structured query keys
- Cache invalidation helpers
- Error handling utilities
- Loading state management
