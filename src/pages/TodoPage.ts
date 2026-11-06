import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Page Object for the TodoMVC demo app.
 * Locators use roles, labels and test ids only: no CSS or XPath in specs.
 * Replace this file with Page Objects for your own app.
 */
export class TodoPage {
  readonly newTodoInput: Locator;
  readonly items: Locator;
  readonly titles: Locator;
  readonly counter: Locator;
  readonly clearCompletedButton: Locator;
  readonly toggleAll: Locator;

  constructor(private readonly page: Page) {
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.items = page.getByTestId('todo-item');
    this.titles = page.getByTestId('todo-title');
    this.counter = page.getByTestId('todo-count');
    this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
    this.toggleAll = page.getByLabel('Mark all as complete');
  }

  async open(): Promise<void> {
    await this.page.goto('./');
    await expect(this.newTodoInput).toBeVisible();
  }

  async add(...titles: string[]): Promise<void> {
    for (const title of titles) {
      await this.newTodoInput.fill(title);
      await this.newTodoInput.press('Enter');
    }
  }

  item(title: string): Locator {
    return this.items.filter({ hasText: title });
  }

  async complete(title: string): Promise<void> {
    await this.item(title).getByRole('checkbox', { name: 'Toggle Todo' }).check();
  }

  async remove(title: string): Promise<void> {
    const item = this.item(title);
    await item.hover();
    await item.getByRole('button', { name: 'Delete' }).click();
  }

  async rename(from: string, to: string): Promise<void> {
    const item = this.item(from);
    await item.dblclick();
    const editor = item.getByRole('textbox', { name: 'Edit' });
    await editor.fill(to);
    await editor.press('Enter');
  }

  async filterBy(filter: 'All' | 'Active' | 'Completed'): Promise<void> {
    await this.page.getByRole('link', { name: filter }).click();
  }
}
