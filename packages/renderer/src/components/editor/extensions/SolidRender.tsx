// @ts-nocheck
import { Editor } from "@tiptap/core";
import { Component } from "solid-js";

export interface SolidRendererOptions {
  editor: Editor;
  props?: Record<string, any>;
  as?: string;
  className?: string;
}

export class SolidRender<R = unknown, P = unknown> {
  id: string;
  component: any;
  editor: Editor;
  element: Element;
  props: Record<string, any>;
  solidElement: Component;
  ref: R | null = null;
  constructor(
    component: Component,
    { editor, props = {}, as = "div", className = "" }: SolidRendererOptions
  ) {
    this.id = Math.floor(Math.random() * 0xffffffff).toString();
    this.component = component;
    this.editor = editor;
    this.props = props;
    this.element = document.createElement(as);
    this.element.classList.add("react-renderer");

    if (className) {
      this.element.classList.add(...className.split(" "));
    }

    this.render();
  }
  render() {
    const Component = this.component;
    const props = this.props;

    // if (isClassComponent(Component) || isForwardRefComponent(Component)) {
    //   props.ref = (ref: R) => {
    //     this.ref = ref;
    //   };
    // }

    this.solidElement = <Component {...props} />;
    if (this.editor?.contentComponent) {
      this.editor.contentComponent.setState({
        renderers: this.editor.contentComponent.state.renderers.set(
          this.id,
          this
        ),
      });
    }
  }
  updateProps(props: Record<string, any> = {}): void {
    this.props = {
      ...this.props,
      ...props,
    };

    this.render();
  }
  destroy(): void {
    if (this.editor?.contentComponent) {
      const { renderers } = this.editor.contentComponent.state;

      renderers.delete(this.id);

      this.editor.contentComponent.setState({
        renderers,
      });
    }
  }
}
