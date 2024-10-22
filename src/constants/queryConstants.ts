export const GET_ALL_USERS = "SELECT u.id, b.weeklyBalance as 'score' FROM user u LEFT JOIN balance b ON u.id = b.userId "
export const RESET_WEEKLY_BALANCES = "UPDATE balance SET weeklyBalance = 0"