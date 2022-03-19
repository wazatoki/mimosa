import { recieve } from './stock';

test("usecase stock recieve", async () => {
    
    const resultID = 'test_created_id';
    const stockRecieve = {id: null};
    const stockRecieveRepo = {
        insert: jest.fn().mockReturnValue(resultID),
    };
    const opeStaffID = 'ope_test_staff_1';

    const stockRecieve2 = await recieve(stockRecieve, stockRecieveRepo, opeStaffID);

    expect(stockRecieveRepo.insert).toHaveBeenCalledWith(stockRecieve, opeStaffID);
    expect(stockRecieve.id).toBe(resultID);
});