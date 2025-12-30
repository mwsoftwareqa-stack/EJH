import { GuestsContext } from '../contexts/guestsContext';
import { test } from '../core/fixtures/baseFixture';
import { WebApiClient } from '../services/webApi/webApiClient';

export class AuthenticationFactory {
  constructor(private webApiClient: WebApiClient) {
    this.webApiClient = webApiClient;
  }

  async createAccount(context: GuestsContext): Promise<void> {
    await test.step('Create account via Web API', async () => {
        await this.webApiClient.register(context.leadPassenger.email, context.leadPassenger.password);
    });
  }

  async createAccountAndLogIn(context: GuestsContext): Promise<void> {
    await test.step('Create account and Log in via Web API', async () => {
        await this.webApiClient.register(context.leadPassenger.email, context.leadPassenger.password);
        await this.webApiClient.logIn(context.leadPassenger.email, context.leadPassenger.password);
    });
  }

  async loginAccount(context: GuestsContext): Promise<void> {
    await test.step('Login via Web API', async () => {
        await this.webApiClient.logIn(context.leadPassenger.email, context.leadPassenger.password);
    });
  }
}
