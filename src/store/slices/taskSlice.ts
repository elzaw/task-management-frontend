import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import instance from "../../axois/instance"; // Corrected the import path

interface Task {
  completed: boolean;
  dueDate: Date;
  _id: string;
  title: string;
  description: string;
  category: string;
}

type FetchTasksResponse = Task[];

interface TasksState {
  [x: string]: any;
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};
export const fetchTasks = createAsyncThunk<Task[]>(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/task");
      console.log("API Response:", response.data);
      return response.data as Task[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchTasks.fulfilled,
      (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
        state.error = null; // Reset error when fetching is successful
      }
    );
  },
});

export default tasksSlice.reducer;
