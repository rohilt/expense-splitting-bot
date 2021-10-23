/* eslint-disable require-jsdoc */

module.exports = class Event {
  constructor(name, pinnedMsg) {
    this.name = name;
    this.pinnedMsg = pinnedMsg;
    this.txnId = 0;
    this.txns = [];
  }
  addTxn = (amount, description, whoPaid) => {
    if (!amount || !description || !whoPaid) {
      throw Error('null parameters');
    };
    this.txns = [...this.txns, {
      id: this.txnId,
      amount: amount,
      description: description,
      whoPaid: whoPaid,
    }];
    return this.txnId++;
  };
  getAllTxns = () => {
    return this.txns;
  };

  getNextId = () => this.txnId;

  getTxn = (findId) => {
    if (!findId) {
      throw Error('null id');
    }
    return this.txns.filter(({id}) => id == findId)[0];
  };

  deleteTxn = (findId) => {
    if (!findId || !txns.filter(({id}) => id == findId)) {
      throw Error('txn not found');
    }
    txns = txns.filter(({id}) => id != findId);
    return findId;
  };

  updateTxn = (findId, updatedTxn) => {
    if (!findId || !this.txns.filter(({id}) => id == findId)) {
      throw Error('txn not found');
    }
    this.txns[findId] = {
      ...updatedTxn,
      id: this.txnId,
    };
    return this.txnId++;
  };

  getSimplifyingTxns = (allUsers) => {
    const graph = allUsers.reduce((p, c) => ({
      ...p,
      [c]: allUsers.reduce((p2, c2) => ({
        ...p2,
        [c2]: 0,
      }), {}),
    }), {});
    this.txns.forEach((txn) => {
      const owed = txn.amount / allUsers.length;
      allUsers.filter((user) => user != txn.whoPaid).forEach((user) => {
        graph[user][txn.whoPaid] += owed;
        graph[txn.whoPaid][user] -= owed;
      });
    });
    let result = [];
    allUsers.forEach((user1) => {
      allUsers.forEach((user2) => {
        if (user1 != user2 && graph[user1][user2] > 0) {
          result = [...result, {
            amount: graph[user1][user2],
            whoPays: user1,
            whoOwes: user2,
          }];
        }
      });
    });
    return result;
  };
};
