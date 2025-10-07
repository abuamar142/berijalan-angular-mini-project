import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IProfile, ITodo } from '../../utils/interface';
import { Profile } from '../../services/profile';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cv',
  imports: [CommonModule, FormsModule],
  templateUrl: './cv.html',
  styleUrl: './cv.scss',
})
export class Cv {
  techStack: string[] = [
    'HTML',
    'CSS',
    'JavaScript',
    'TypeScript',
    'Angular',
    'React',
    'Node.js',
    'MongoDB',
    'SQL',
  ];
  profile: IProfile = {
    name: '',
    role: '',
    email: '',
    website: '',
    phone: '',
    location: '',
  };

  constructor(private profileService: Profile) {
    this.profile = this.profileService.getProfile();
  }

  todos: ITodo[] = [];

  newTodo: string = '';

  addTodo() {
    if (this.newTodo.trim()) {
      this.todos = [
        ...this.todos,
        { task: this.newTodo, completed: false },
      ];
      this.newTodo = '';
    }
  }

  completeTodo(index: number) {
    this.todos[index].completed = !this.todos[index].completed;
    this.todos = [...this.todos];
  }

  deleteTodo(index: number) {
    this.todos.splice(index, 1);
    this.todos = [...this.todos];
  }
}
