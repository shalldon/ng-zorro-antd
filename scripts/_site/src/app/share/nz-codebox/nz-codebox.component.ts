import { DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Component, ElementRef, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector     : 'nz-code-box',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <section class="code-box" [ngClass]="{'expand':nzExpanded}" [attr.id]="nzId">
      <section class="code-box-demo">
        <div *ngIf="!showIframe" [class.simulate-iframe]="simulateIFrame" [class.browser-mockup]="simulateIFrame" [class.with-url]="simulateIFrame" [style.height.px]="simulateIFrame&&nzIframeHeight">
          <ng-content select="[demo]"></ng-content>
        </div>
        <div class="browser-mockup with-url" *ngIf="showIframe"><iframe [src]="iframe" [height]="nzIframeHeight" title="demo"></iframe></div>
      </section>
      <section class="code-box-meta markdown">
        <div class="code-box-title">
          <a (click)="navigateToFragment()">{{ nzTitle }}
            <a class="edit-button" [attr.href]="nzHref" target="_blank" style="">
              <i class="anticon anticon-edit"></i>
            </a>
          </a>
        </div>
        <ng-content select="[intro]"></ng-content>
        <nz-tooltip [nzTitle]="nzExpanded?'收起代码':'展开代码'">
        <span class="code-expand-icon" nz-tooltip (click)="nzExpanded=!nzExpanded">
            <img alt="expand code" src="https://gw.alipayobjects.com/zos/rmsportal/wSAkBuJFbdxsosKKpqyq.svg" [class.code-expand-icon-show]="nzExpanded" [class.code-expand-icon-hide]="!nzExpanded">
            <img alt="expand code" src="https://gw.alipayobjects.com/zos/rmsportal/OpROPHYqWmrMDBFMZtKF.svg" [class.code-expand-icon-show]="!nzExpanded" [class.code-expand-icon-hide]="nzExpanded">
          </span>
        </nz-tooltip>
      </section>
      <section class="highlight-wrapper" [ngClass]="{'highlight-wrapper-expand':nzExpanded}">
        <div class="highlight">
          <div class="code-box-actions">
            <nz-tooltip [nzTitle]="'复制代码'">
            <i nz-tooltip class="anticon code-box-code-copy" [class.anticon-copy]="!_copied" [class.anticon-check]="_copied" [class.ant-tooltip-open]="_copied" (click)="copyCode(_code)"></i>
            </nz-tooltip>
          </div>
          <nz-highlight [nzCode]="_code" [nzLanguage]="'typescript'"></nz-highlight>
        </div>
      </section>
    </section>
  `,
  styleUrls    : [
    './nz-codebox.less'
  ]
})
export class NzCodeBoxComponent implements OnInit {
  _code: string;
  _copied = false;
  showIframe: boolean;
  simulateIFrame: boolean;
  iframe: SafeUrl;
  @Input() nzTitle: string;
  @Input() nzExpanded = false;
  @Input() nzHref: string;
  @Input() nzLink: string;
  @Input() nzId: string;
  @Input() nzIframeHeight = 360;

  @Input() set nzIframeSource(value: string) {
    this.showIframe = (value!='null') && environment.production;
    this.simulateIFrame = (value!='null') && !environment.production;
    this.iframe = this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }

  @Input()
  get nzCode(): string {
    return this._code;
  }

  set nzCode(value: string) {
    this._code = value;
  }

  navigateToFragment() {
    window.location.hash = this.nzLink;
  }

  copyCode(code) {
    this.copy(code).then(() => {
      this._copied = true;
      setTimeout(() => {
        this._copied = false;
      }, 1000);
    });
  }

  copy(value: string): Promise<string> {

    const promise = new Promise<string>(
      (resolve, reject): void => {
        let copyTextArea = null as HTMLTextAreaElement;
        try {
          copyTextArea = this.dom.createElement('textarea');
          copyTextArea.style.height = '0px';
          copyTextArea.style.opacity = '0';
          copyTextArea.style.width = '0px';
          this.dom.body.appendChild(copyTextArea);
          copyTextArea.value = value;
          copyTextArea.select();
          this.dom.execCommand('copy');
          resolve(value);
        } finally {
          if (copyTextArea && copyTextArea.parentNode) {
            copyTextArea.parentNode.removeChild(copyTextArea);
          }
        }
      }
    );

    return (promise);

  }

  constructor(@Inject(DOCUMENT) private dom: Document, private sanitizer: DomSanitizer, private _el: ElementRef, private activatedRoute: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
  }
}