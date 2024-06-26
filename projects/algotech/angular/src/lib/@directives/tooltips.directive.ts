import { Directive, Input, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
    selector: '[at-tooltip]',
    exportAs: 'at-tooltip',
})
export class TooltipsDirective {

    @Input('at-tooltip') tooltipTitle: string;
    @Input() placement = 'bottom';
    @Input() delay = 200;
    @Input() sizeMin = 0;
    @Input() alwaysShow = false;
    tooltip: HTMLElement;
    offset = 10;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) { }

    @HostListener('focusin')
    @HostListener('mouseenter')
    onMouseEnter() {
        const element = this.el.nativeElement;
        if (!this.tooltip && this.tooltipTitle && this.tooltipTitle.length >= this.sizeMin &&
            (element.offsetWidth < element.scrollWidth || this.alwaysShow)) { this.show(); }
    }

    @HostListener('focusout')
    @HostListener('mouseleave')
    onMouseLeave() {
        if (this.tooltip) { this.hide(); }
    }

    show() {
        this.create();
        this.setPosition();
        this.renderer.addClass(this.tooltip, 'ng-tooltip-show');
    }

    hide() {
        if (this.tooltip) {
            this.renderer.removeClass(this.tooltip, 'ng-tooltip-show');
            this.renderer.removeChild(document.body, this.tooltip);
            this.tooltip = null;
        }
    }

    create() {
        this.tooltip = this.renderer.createElement('span');

        this.renderer.appendChild(
            this.tooltip,
            this.renderer.createText(this.tooltipTitle) // textNode
        );

        this.renderer.appendChild(document.body, this.tooltip);
        // this.renderer.appendChild(this.el.nativeElement, this.tooltip);

        this.renderer.addClass(this.tooltip, 'ng-tooltip');
        this.renderer.addClass(this.tooltip, `ng-tooltip-${this.placement}`);

        this.renderer.setStyle(this.tooltip, '-webkit-transition', `opacity ${this.delay}ms`);
        this.renderer.setStyle(this.tooltip, '-moz-transition', `opacity ${this.delay}ms`);
        this.renderer.setStyle(this.tooltip, '-o-transition', `opacity ${this.delay}ms`);
        this.renderer.setStyle(this.tooltip, 'transition', `opacity ${this.delay}ms`);
    }

    setPosition() {
        const hostPos = this.el.nativeElement.getBoundingClientRect();
        const tooltipPos = this.tooltip.getBoundingClientRect();
        const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        let top, left;

        if (this.placement === 'top') {
            top = hostPos.top - tooltipPos.height - this.offset;
            left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
        }

        if (this.placement === 'bottom') {
            top = hostPos.bottom + this.offset;
            left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
        }

        if (this.placement === 'left') {
            top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
            left = hostPos.left - tooltipPos.width - this.offset;
        }

        if (this.placement === 'right') {
            top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
            left = hostPos.right + this.offset;
        }

        this.renderer.setStyle(this.tooltip, 'top', `${top + scrollPos}px`);
        this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
    }

}
