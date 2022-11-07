import { ContractPromiseBatch, base58, context, storage } from 'near-sdk-as';

@nearBindgen
export class Contract {
  @mutateState()
  setRecoveryState(
    recoveryAccount: string,
    recoveryDate: u64
  ): Map<string, string> {
    assert(
      context.contractName == context.predecessor,
      'Access denied! only the account owner can initialize the recovery state.'
    );
    storage.set<string>('recoveryAccount', recoveryAccount);
    storage.set<u64>('recoveryDate', recoveryDate);
    storage.set<bool>('isRecovered', false);

    let stateMap: Map<string, string> = new Map<string, string>();
    stateMap.set('recoveryAccount', storage.getSome<string>('recoveryAccount'));
    stateMap.set(
      'recoveryDate',
      storage.getSome<u64>('recoveryDate').toString()
    );
    stateMap.set(
      'isRecovered',
      storage.getSome<bool>('isRecovered').toString()
    );
    return stateMap;
  }

  @mutateState()
  recoverAccount(newFullAccessKey: string, oldFullAccessKeys: Array<string>): string {
    assert(
      storage.getSome<string>('recoveryAccount') == context.predecessor,
      'Access denied! only the account recovery account can recover the account.'
    );
    assert(
      storage.getSome<u64>('recoveryDate') <= this.blockTimestampInSeconds(),
      'Date not reached! recovery date was not reached yet.'
    );
    assert(
      storage.getSome<bool>('isRecovered') == false,
      'Account has already been recovered.'
    );
    const access_key = base58.decode(newFullAccessKey);
    ContractPromiseBatch.create(context.contractName).add_full_access_key(
      access_key
    );
    storage.set<bool>('isRecovered', true);
    oldFullAccessKeys.forEach(keyString => {
      const fullAccessKey = base58.decode(keyString);
      ContractPromiseBatch.create(context.contractName).delete_key(
        fullAccessKey
      );
    });
    return newFullAccessKey + ' was added as a full access key and old full-access keys were removed';
  }

  viewRecoveryState(): Map<string, string> {
    let stateMap: Map<string, string> = new Map<string, string>();
    stateMap.set('recoveryAccount', storage.getSome<string>('recoveryAccount'));
    stateMap.set(
      'recoveryDate',
      storage.getSome<u64>('recoveryDate').toString()
    );
    stateMap.set(
      'isRecovered',
      storage.getSome<bool>('isRecovered').toString()
    );

    return stateMap;
  }

  getCurrentTimestamp(): u64 {
    return context.blockTimestamp;
  }

  private blockTimestampInSeconds(): u64 {
    return (context.blockTimestamp / 1000000) as u64;
  }
}
