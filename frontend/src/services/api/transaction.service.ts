// transaction.service.ts
// Mock service for Phase 2 before real Auth is implemented

export interface TransactionPayload {
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description?: string;
  sourceJarId?: string; // for expense and transfer
  destinationJarId?: string; // for transfer
}

class TransactionService {
  private baseUrl = '/api/v1/transactions'; // Mock URL for now

  async createTransaction(payload: TransactionPayload): Promise<any> {
    console.log('[Mock API] Creating transaction:', payload);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simulate success response
    return {
      success: true,
      message: 'Transaction saved successfully',
      data: {
        id: crypto.randomUUID(),
        ...payload,
        createdAt: new Date().toISOString()
      }
    };
  }
}

export const transactionService = new TransactionService();
