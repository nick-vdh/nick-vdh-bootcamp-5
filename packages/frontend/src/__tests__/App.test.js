import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const jsonResponse = (body, ok = true) => ({
  ok,
  status: ok ? 200 : 500,
  json: async () => body,
});

const setupApi = (initialTodos = []) => {
  const todos = initialTodos.map((todo) => ({ ...todo }));
  global.fetch = jest.fn(async (url, options = {}) => {
    const path = String(url).replace(/^https?:\/\/[^/]+/, '');
    const method = options.method || 'GET';

    if (path === '/api/todos' && method === 'GET') {
      return jsonResponse(todos.map((todo) => ({ ...todo })));
    }
    if (path === '/api/todos' && method === 'POST') {
      const todo = {
        id: todos.length + 1,
        ...JSON.parse(options.body),
        completed: false,
      };
      todos.push(todo);
      return jsonResponse(todo);
    }

    const id = Number(path.split('/').pop());
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) return jsonResponse({ error: 'Todo not found' }, false);

    if (method === 'DELETE') {
      return jsonResponse(todos.splice(todoIndex, 1)[0]);
    }
    if (method === 'PUT') {
      Object.assign(todos[todoIndex], JSON.parse(options.body));
      return jsonResponse(todos[todoIndex]);
    }
    if (method === 'PATCH') {
      todos[todoIndex].completed = !todos[todoIndex].completed;
      return jsonResponse(todos[todoIndex]);
    }
    return jsonResponse({ error: 'Unsupported request' }, false);
  });
  return global.fetch;
};

const renderApp = () => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );
};

test('renders TODO App heading', async () => {
  setupApi();
  renderApp();

  const headingElement = await screen.findByText(/TODO App/i);
  expect(headingElement).toBeInTheDocument();
});

test('uses the relative todos API path', async () => {
  const fetchMock = setupApi();
  renderApp();

  await screen.findByText(/No todos yet/i);
  expect(fetchMock).toHaveBeenCalledWith('/api/todos');
});

test('shows counts derived from todos', async () => {
  setupApi([
    { id: 1, title: 'Write tests', completed: false },
    { id: 2, title: 'Review changes', completed: false },
    { id: 3, title: 'Ship feature', completed: true },
  ]);
  renderApp();

  expect(await screen.findByText('2 items left')).toBeInTheDocument();
  expect(screen.getByText('1 completed')).toBeInTheDocument();
});

test('shows an empty state when there are no todos', async () => {
  setupApi();
  renderApp();

  expect(await screen.findByText(/No todos yet/i)).toBeInTheDocument();
});

test('deletes a todo through the API', async () => {
  const fetchMock = setupApi([{ id: 1, title: 'Remove this', completed: false }]);
  const user = userEvent.setup();
  renderApp();

  await user.click(await screen.findByRole('button', { name: 'Delete Remove this' }));

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledWith('/api/todos/1', { method: 'DELETE' });
  });
  expect(await screen.findByText(/No todos yet/i)).toBeInTheDocument();
});

test('shows feedback when deleting a todo fails', async () => {
  const fetchMock = setupApi([{ id: 1, title: 'Keep this', completed: false }]);
  const originalImplementation = fetchMock.getMockImplementation();
  fetchMock.mockImplementation((url, options = {}) => {
    if (options.method === 'DELETE') {
      return Promise.resolve(jsonResponse({ error: 'Unavailable' }, false));
    }
    return originalImplementation(url, options);
  });
  const user = userEvent.setup();
  renderApp();

  await user.click(await screen.findByRole('button', { name: 'Delete Keep this' }));

  expect(await screen.findByRole('alert')).toHaveTextContent(/unable to delete todo/i);
});

test('edits a todo title through the API', async () => {
  const fetchMock = setupApi([{ id: 1, title: 'Old title', completed: false }]);
  const user = userEvent.setup();
  renderApp();

  await user.click(await screen.findByRole('button', { name: 'Edit Old title' }));
  await user.clear(screen.getByRole('textbox', { name: 'Edit todo' }));
  await user.type(screen.getByRole('textbox', { name: 'Edit todo' }), 'New title');
  await user.click(screen.getByRole('button', { name: 'Save' }));

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledWith('/api/todos/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New title' }),
    });
  });
  expect(await screen.findByText('New title')).toBeInTheDocument();
});

test('shows feedback when loading todos fails', async () => {
  global.fetch = jest.fn().mockResolvedValue(
    jsonResponse({ error: 'Unavailable' }, false)
  );
  renderApp();

  expect(await screen.findByRole('alert')).toHaveTextContent(/unable to load todos/i);
});

afterEach(() => {
  jest.clearAllMocks();
});
