import { test, expect } from '../../src/fixtures';
import { buildTodoTitle } from '../../src/fixtures/factories';

test.describe('Todo list', () => {
  test('adds items and shows the remaining count', async ({ todoPage }) => {
    const first = buildTodoTitle('Write tests');
    const second = buildTodoTitle('Review PR');

    await todoPage.add(first, second);

    await expect(todoPage.titles).toHaveText([first, second]);
    await expect(todoPage.counter).toHaveText('2 items left');
  });

  test('does not add an empty item', async ({ todoPage }) => {
    await todoPage.add('   ');

    await expect(todoPage.items).toHaveCount(0);
  });

  test('completing an item updates the counter', async ({ todoPage }) => {
    const done = buildTodoTitle('Done');
    const pending = buildTodoTitle('Pending');
    await todoPage.add(done, pending);

    await todoPage.complete(done);

    await expect(todoPage.item(done)).toHaveClass(/completed/);
    await expect(todoPage.counter).toHaveText('1 item left');
  });

  test('filters active and completed items', async ({ todoPage }) => {
    const done = buildTodoTitle('Done');
    const pending = buildTodoTitle('Pending');
    await todoPage.add(done, pending);
    await todoPage.complete(done);

    await todoPage.filterBy('Active');
    await expect(todoPage.titles).toHaveText([pending]);

    await todoPage.filterBy('Completed');
    await expect(todoPage.titles).toHaveText([done]);

    await todoPage.filterBy('All');
    await expect(todoPage.titles).toHaveText([done, pending]);
  });

  test('renames an item', async ({ todoPage }) => {
    const original = buildTodoTitle('Original');
    const renamed = buildTodoTitle('Renamed');
    await todoPage.add(original);

    await todoPage.rename(original, renamed);

    await expect(todoPage.titles).toHaveText([renamed]);
  });

  test('deletes an item', async ({ todoPage }) => {
    const keep = buildTodoTitle('Keep');
    const remove = buildTodoTitle('Remove');
    await todoPage.add(keep, remove);

    await todoPage.remove(remove);

    await expect(todoPage.titles).toHaveText([keep]);
  });

  test('clears completed items', async ({ todoPage }) => {
    const done = buildTodoTitle('Done');
    const pending = buildTodoTitle('Pending');
    await todoPage.add(done, pending);
    await todoPage.complete(done);

    await todoPage.clearCompletedButton.click();

    await expect(todoPage.titles).toHaveText([pending]);
    await expect(todoPage.clearCompletedButton).toBeHidden();
  });

  test('keeps items after a page reload', async ({ todoPage, page }) => {
    const title = buildTodoTitle('Persisted');
    await todoPage.add(title);
    await todoPage.complete(title);

    await page.reload();

    await expect(todoPage.titles).toHaveText([title]);
    await expect(todoPage.item(title)).toHaveClass(/completed/);
  });
});
