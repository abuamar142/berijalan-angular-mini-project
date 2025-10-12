import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info'
  | 'gradient';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() icon: string = '';
  @Input() rounded: boolean = true;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Output() buttonClick = new EventEmitter<Event>();

  onClick(event: Event) {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit(event);
    }
  }

  getButtonClasses(): string {
    let classes =
      'inline-flex items-center justify-center font-bold transition-all duration-200 hover:cursor-pointer';

    // Full Width
    if (this.fullWidth) {
      classes += ' w-full';
    }

    // Size classes
    switch (this.size) {
      case 'sm':
        classes += ' px-3 py-2 text-sm';
        break;
      case 'md':
        classes += ' px-4 py-3 text-base';
        break;
      case 'lg':
        classes += ' px-6 py-3 text-lg';
        break;
      case 'xl':
        classes += ' px-8 py-4 text-xl';
        break;
    }

    // Rounded classes
    if (this.rounded) {
      classes += this.size === 'sm' ? ' rounded-lg' : ' rounded-2xl';
    }

    // Variant classes
    if (this.disabled || this.loading) {
      classes += ' bg-gray-400 text-gray-600 cursor-not-allowed opacity-50';
    } else {
      switch (this.variant) {
        case 'primary':
          classes +=
            ' bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105';
          break;
        case 'secondary':
          classes +=
            ' bg-white hover:bg-purple-50 text-purple-600 border-2 border-purple-200 hover:border-purple-300 shadow-lg hover:shadow-xl';
          break;
        case 'danger':
          classes +=
            ' bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105';
          break;
        case 'success':
          classes +=
            ' bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105';
          break;
        case 'warning':
          classes +=
            ' bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105';
          break;
        case 'info':
          classes +=
            ' bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105';
          break;
        case 'gradient':
          classes +=
            ' bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105';
          break;
      }
    }

    return classes;
  }
}
