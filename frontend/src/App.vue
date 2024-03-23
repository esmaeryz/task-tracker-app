<template>
  <div class="main">
    <div class="custom-form">
      <div class="input-container">
        <input
          class="form-input"
          id="input-2"
          v-model="newTask"
          placeholder="Enter Task"
          @keyup.enter="add"
        />
        <button @click="add" class="form-button">Add</button>
      </div>
    </div>
    <div class="boards-container">
      <div class="board" v-for="(elem, idx) in boardArr" :key="idx">
        <div class="w-[85%] flex h-full">
          <div class="h-full w-full">
            <div class="board-title">
              <h1>{{ elem["title"] }}</h1>
            </div>
            <draggable class="h-full" :list="elem['arr']" group="tasks">
              <div
                class="draggable-element"
                v-for="element in elem['arr']"
                :key="element.name"
              >
                <div
                  class="h-full text-xs lg:text-base flex items-center absolute left-5"
                >
                  <p>{{ element.name }}</p>
                </div>
                <button
                  class="task-delete-button"
                  id="input-2"
                  @click="deleteTask(element)"
                >
                  Delete
                </button>
              </div>
            </draggable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import axiosHook from "./utils/axiosHook";

export default {
  name: "trello-board",
  components: {
    draggable,
  },
  data() {
    return {
      taskToDelete: {},
      newTask: "",
      boardArr: [
        { title: "Backlog", arr: [] },
        { title: "In Progress", arr: [] },
        { title: "Testing", arr: [] },
        { title: "Done", arr: [] },
      ],
    };
  },
  // I used created hook to fetch the data from the backend on component mount
  async created() {
    try {
      const data = await axiosHook("GET");
      if (data) {
        data.forEach((task) => {
          const thisTasksBoard = this.boardArr.find(
            (board) => board.title === task.board
          );

          thisTasksBoard.arr.push(task);
        });
      }
    } catch (error) {
      console.error("Error in fetching data", error);
    }
  },
  methods: {
    async add() {
      if (this.newTask) {
        try {
          const updatedData = await axiosHook("POST", {
            name: this.newTask,
            board: "Backlog",
          });
          // Add new task to the where it belongs
          // which is always the Backlog on creation
          updatedData.forEach((task) => {
            if (task.name === this.newTask) {
              this.boardArr[0].arr.push(task);
            }
          });
        } catch (error) {
          console.error("Error when adding new task", error);
        }

        // Clear the input field after creation
        this.newTask = "";
      }
    },
    async deleteTask(task) {
      try {
        await axiosHook("DELETE", task);
        // After deletion instead of fetching all the data again
        // we can just remove that particulat task from the boardArr
        // by finding the board where the task belongs and then
        // filtering out the task from that board
        const deletedTasksBoard = this.boardArr.find(
          (board) => board.title === task.board
        );
        deletedTasksBoard.arr = deletedTasksBoard.arr.filter(
          (elem) => elem.name !== task.name
        );
      } catch (error) {
        console.error("Error in deleting task", error);
      }
    },
    // It wasn't asked to edit the tasks
    // so we don't have a edit button, but
    // I created and used this function to update the board
    // of the tasks if they're moved from one board to another
    updateTask(newVal) {
      newVal.forEach((kanbanBoard) => {
        if (kanbanBoard.arr.length === 0) return;
        kanbanBoard.arr.forEach(async (task) => {
          if (task.board !== kanbanBoard.title) {
            task.board = kanbanBoard.title;
            await axiosHook("PUT", task);
          }
        });
      });
    },
  },
  // I used watch to catch the changes in the boardArr
  // and then update the board of the tasks if they're moved
  // using the updateTask function that I created
  watch: {
    boardArr: {
      handler(newVal) {
        this.updateTask(newVal);
      },
      // we need to deep watch the boardArr because it's an array of objects
      // otherwise it would've only caught if the boards themselves were changed
      deep: true,
    },
  },
};
</script>
