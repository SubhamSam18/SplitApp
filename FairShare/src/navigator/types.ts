export type AuthStackParamList = {
    Login: undefined;
    SignUp: undefined;
};

export type MainStackParamList = {
    Tabs: undefined;
    CreateGroup: undefined;
    Groups: undefined;
    GroupDetails: { groupId: string; groupName: string };
    CreateExpense: { groupId: string; groupMembers: { _id: string; name: string; email: string }[]; pageName: string, expenseType: string };
    ExpenseDetails: { expenseId: string };
};
