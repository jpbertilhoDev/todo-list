import { Component, OnInit, computed, effect, inject } from '@angular/core';
import { CommonModule, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';

import { TodoSignalsService } from 'src/app/services/todo-signals.service';
import { TodoKeyLocalStorage } from 'src/app/models/model/enum/todoKeyLocalStorage';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { Todo } from 'src/app/models/model/todo.model';

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgTemplateOutlet,

    MatCardModule,
    MatIconModule,
    MatTabsModule

  ],
  templateUrl: './todo-card.component.html',
  styleUrls: []
})
export class TodoCardComponent implements OnInit {

  private todoSignalsService = inject(TodoSignalsService);
  private todoSignal = this.todoSignalsService.todosState;
  public todosList = computed(() => this.todoSignal());

  constructor() {
    effect(() => {
      console.log('SIGNAL FOI ATUALIZADO', this.todoSignalsService.todosState());
    })
  }

  public ngOnInit(): void {
    this.getTodosInLocalStorage();
  }

  private getTodosInLocalStorage(): void {
    const todosDatas = localStorage.getItem(TodoKeyLocalStorage.TODO_LIST) as string;
    todosDatas && (this.todoSignal.set(JSON.parse(todosDatas)));
  }

  private saveTodoInLocalStorage(): void {
    this.todoSignalsService.saveTodosInLocalStorage();
  }

  public handleDoneTodo(todoID: number): void {
    if (todoID) {
      this.todoSignal.mutate((todos) => {
        const todoSelected = todos.find((todo) => todo?.id === todoID) as Todo;
        todoSelected && (todoSelected.done = true);
        this.saveTodoInLocalStorage();
      });
    }
  }

  public handleDeleteTodo(todo: Todo): void {
    if (todo) {
      const index = this.todosList().indexOf(todo);

      if (index !== -1) {
        this.todoSignal.mutate((todos) => {
          todos.splice(index, 1);
          this.saveTodoInLocalStorage();
        })
      }
    }
  }
}
