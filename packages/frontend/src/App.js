import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  Checkbox,
  IconButton,
  Paper,
  CircularProgress,
  Chip,
  Stack,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import './App.css';

const API_URL = '/api/todos';

const ensureSuccessfulResponse = (response, message) => {
  if (!response.ok) throw new Error(message);
  return response;
};

// React Query hook for fetching todos
const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await fetch(API_URL);
      ensureSuccessfulResponse(response, 'Unable to load todos');
      return response.json();
    },
  });
};

function App() {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editedTodoTitle, setEditedTodoTitle] = useState('');
  const queryClient = useQueryClient();

  // Fetch todos using React Query
  const { data: todos = [], isLoading, isError } = useTodos();

  // Mutation for adding a new todo
  const addTodoMutation = useMutation({
    mutationFn: async (title) => {
      // INTENTIONAL ISSUE: Missing validation for empty title
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      ensureSuccessfulResponse(response, 'Unable to add todo');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setNewTodoTitle('');
    },
  });

  // Mutation for toggling todo completion
  const toggleTodoMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`${API_URL}/${id}/toggle`, {
        method: 'PATCH',
      });
      ensureSuccessfulResponse(response, 'Unable to update todo');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      ensureSuccessfulResponse(response, 'Unable to delete todo');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const editTodoMutation = useMutation({
    mutationFn: async ({ id, title }) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      ensureSuccessfulResponse(response, 'Unable to save todo');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setEditingTodoId(null);
      setEditedTodoTitle('');
    },
  });

  const completedCount = todos.filter((todo) => todo.completed).length;
  const incompleteCount = todos.length - completedCount;
  const errorMessage = isError
    ? 'Unable to load todos.'
    : addTodoMutation.isError
      ? 'Unable to add todo.'
      : toggleTodoMutation.isError
        ? 'Unable to update todo.'
        : deleteTodoMutation.isError
          ? 'Unable to delete todo.'
          : editTodoMutation.isError
            ? 'Unable to save todo.'
            : '';

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      addTodoMutation.mutate(newTodoTitle);
    }
  };

  const handleToggleTodo = (id) => {
    toggleTodoMutation.mutate(id);
  };

  const handleDeleteTodo = (id) => {
    deleteTodoMutation.mutate(id);
  };

  const handleEditTodo = (todo) => {
    setEditingTodoId(todo.id);
    setEditedTodoTitle(todo.title);
  };

  const handleSaveTodo = () => {
    const title = editedTodoTitle.trim();
    if (title) editTodoMutation.mutate({ id: editingTodoId, title });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            TODO App
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Session 5: Agentic Development
          </Typography>
        </Paper>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box
              component="form"
              onSubmit={handleAddTodo}
              sx={{ display: 'flex', gap: 2 }}
            >
              <TextField
                fullWidth
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                placeholder="What needs to be done?"
                variant="outlined"
                size="medium"
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ minWidth: 120 }}
              >
                Add
              </Button>
            </Box>
          </CardContent>
        </Card>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}

        <Card>
          {!isLoading && !isError && todos.length === 0 && (
            <Box role="status" sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No todos yet. Add one to get started.
              </Typography>
            </Box>
          )}
          {todos.length > 0 && (
            <List sx={{ p: 0 }}>
              {todos.map((todo, index) => (
              <ListItem
                key={todo.id}
                sx={{
                  borderBottom: index < todos.length - 1 ? 1 : 0,
                  borderColor: 'divider',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Checkbox
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.id)}
                  inputProps={{ 'aria-label': `Mark ${todo.title} completed` }}
                  sx={{ mr: 2 }}
                />
                {editingTodoId === todo.id ? (
                  <>
                    <TextField
                      label="Edit todo"
                      size="small"
                      value={editedTodoTitle}
                      onChange={(event) => setEditedTodoTitle(event.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <Stack direction="row" spacing={1} sx={{ ml: 1 }}>
                      <Button onClick={() => setEditingTodoId(null)}>Cancel</Button>
                      <Button
                        onClick={handleSaveTodo}
                        disabled={!editedTodoTitle.trim()}
                      >
                        Save
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <>
                    <Typography
                      sx={{
                        flex: 1,
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? 'text.secondary' : 'text.primary',
                      }}
                    >
                      {todo.title}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        color="primary"
                        aria-label={`Edit ${todo.title}`}
                        onClick={() => handleEditTodo(todo)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        aria-label={`Delete ${todo.title}`}
                        onClick={() => handleDeleteTodo(todo.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </>
                )}
              </ListItem>
              ))}
            </List>
          )}
        </Card>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Chip label={`${incompleteCount} items left`} color="primary" />
          <Chip label={`${completedCount} completed`} color="success" />
        </Box>
      </Container>
    </Box>
  );
}

export default App;
