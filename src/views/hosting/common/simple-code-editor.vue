<template>
  <div
    :theme="theme"
    class="code-editor"
    :class="{
      scroll: scroll,
      'read-only': readOnly,
      wrap: wrap,
    }"
    :style="{
      width: width,
      height: height,
      zIndex: zIndex,
      maxWidth: maxWidth,
      minWidth: minWidth,
      maxHeight: maxHeight,
      minHeight: minHeight,
    }"
  >
    <div class="hljs" :style="{ borderRadius: borderRadius }">
      <div
        class="code-area"
        :style="{
          borderRadius: borderRadius,
        }"
      >
        <div
          v-if="showLineNums"
          ref="lineNums"
          class="line-nums hljs"
          :style="{
            fontSize: fontSize,
            paddingTop: padding,
            paddingBottom: padding,
            top: top + 'px',
          }"
        >
          <div>1</div>
          <div v-for="num in lineNum" :key="num">{{ num + 1 }}</div>
          <div>&nbsp;</div>
        </div>
        <textarea
          title="textarea"
          :readOnly="readOnly"
          :style="{
            fontSize: fontSize,
            padding: padding,
            marginLeft: showLineNums ? lineNumsWidth + 'px' : '0',
            width: showLineNums
              ? 'calc(100% - ' + lineNumsWidth + 'px)'
              : '100%',
          }"
          ref="textarea"
          :autofocus="autofocus"
          spellcheck="false"
          @keydown.tab.prevent.stop="tab"
          @scroll="calcScrollDistance"
          :value="modelValue == undefined ? content : modelValue"
          @input="updateValue"
        ></textarea>
        <pre
          :style="{
            paddingRight: scrollBarWidth + 'px',
            paddingBottom: scrollBarHeight + 'px',
            marginLeft: showLineNums ? lineNumsWidth + 'px' : '0',
            width: showLineNums
              ? 'calc(100% - ' + lineNumsWidth + 'px)'
              : '100%',
          }"
        >
        <code
          ref="code"
          :style="{
            top: top + 'px',
            left: left + 'px',
            fontSize: fontSize,
            padding:  padding
          }">
        </code>
      </pre>
      </div>
    </div>
  </div>
</template>

<script>
// import "./themes/themes-base16.css";
import "./themes.css";

export default {
  name: "CodeEditor",
  props: {
    lineNums: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: String,
    },
    value: {
      type: String,
    },
    theme: {
      type: String,
      default: "github-dark",
    },
    tabSpaces: {
      type: Number,
      default: 2,
    },
    wrap: {
      type: Boolean,
      default: false,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },

    width: {
      type: String,
      default: "540px",
    },
    height: {
      type: String,
      default: "auto",
    },
    maxWidth: {
      type: String,
    },
    minWidth: {
      type: String,
    },
    maxHeight: {
      type: String,
    },
    minHeight: {
      type: String,
    },
    borderRadius: {
      type: String,
      default: "12px",
    },

    zIndex: {
      type: String,
      default: "0",
    },
    fontSize: {
      type: String,
      default: "14px",
    },
    padding: {
      type: String,
      default: "20px",
    },
  },

  data() {
    return {
      scrollBarWidth: 0,
      scrollBarHeight: 0,
      top: 0,
      left: 0,
      content: this.value,
      cursorPosition: 0,
      insertTab: false,
      lineNum: 0,
      lineNumsWidth: 0,
      scrolling: false,
      textareaHeight: 0,
      showLineNums: this.wrap ? false : this.lineNums,
    };
  },
  computed: {
    tabWidth() {
      let result = "";
      for (let i = 0; i < this.tabSpaces; i++) {
        result += " ";
      }
      return result;
    },
    contentValue() {
      return this.modelValue == undefined
        ? this.content + "\n"
        : this.modelValue + "\n";
    },
    scroll() {
      return this.height == "auto" ? false : true;
    },
  },
  methods: {
    updateValue(e) {
      if (this.modelValue == undefined) {
        this.content = e.target.value;
      } else {
        this.$emit("update:modelValue", e.target.value);
      }
    },

    tab() {
      if (document.execCommand("insertText")) {
        document.execCommand("insertText", false, this.tabWidth);
      } else {
        const cursorPosition = this.$refs.textarea.selectionStart;
        this.content =
          this.content.substring(0, cursorPosition) +
          this.tabWidth +
          this.content.substring(cursorPosition);
        this.cursorPosition = cursorPosition + this.tabWidth.length;
        this.insertTab = true;
      }
    },
    calcScrollDistance(e) {
      this.$refs.code.scrolling = true;
      this.scrolling = true;
      this.top = -e.target.scrollTop;
      this.left = -e.target.scrollLeft;
    },
    resizer() {
      // textareaResizer
      const textareaResizer = new ResizeObserver((entries) => {
        this.scrollBarWidth =
          entries[0].target.offsetWidth - entries[0].target.clientWidth;
        this.scrollBarHeight =
          entries[0].target.offsetHeight - entries[0].target.clientHeight;
        this.textareaHeight = entries[0].target.offsetHeight;
      });
      textareaResizer.observe(this.$refs.textarea);
      // lineNumsResizer
      const lineNumsResizer = new ResizeObserver((entries) => {
        this.lineNumsWidth = entries[0].target.offsetWidth;
      });
      if (this.$refs.lineNums) {
        lineNumsResizer.observe(this.$refs.lineNums);
      }
    },

    getLineNum() {
      // lineNum
      const str = this.$refs.textarea.value;
      let lineNum = 0;
      let position = str.indexOf("\n");
      while (position !== -1) {
        lineNum++;
        position = str.indexOf("\n", position + 1);
      }
      // heightNum
      const singleLineHeight = this.$refs.lineNums.firstChild.offsetHeight;
      if (singleLineHeight != 0) {
        const heightNum = parseInt(this.textareaHeight / singleLineHeight) - 1;
        // // displayed lineNum
        this.lineNum =
          this.height == "auto"
            ? lineNum
            : lineNum > heightNum
            ? lineNum
            : heightNum;
      }
    },
  },
  mounted() {
    this.$emit("content", this.content);
    this.$emit("textarea", this.$refs.textarea);
    this.resizer();
  },
  updated() {
    if (this.insertTab) {
      this.$refs.textarea.setSelectionRange(
        this.cursorPosition,
        this.cursorPosition
      );
      this.insertTab = false;
    }
    if (this.lineNums) {
      if (this.scrolling) {
        this.scrolling = false;
      } else {
        this.getLineNum();
      }
    }
  },
};
</script>

<style>
.code-editor {
  position: relative;
}
.code-editor > div {
  width: 100%;
  height: 100%;
}

/* code-area */
.code-editor .code-area {
  position: relative;
  z-index: 0;
  text-align: left;
  overflow: hidden;
}
/* font style */
.code-editor .code-area > textarea,
.code-editor .code-area > pre > code,
.code-editor .line-nums > div {
  font-family: Consolas, Monaco, monospace;
  line-height: 1.5;
}
.code-editor .code-area > textarea:hover,
.code-editor .code-area > textarea:focus-visible {
  outline: none;
}
.code-editor .code-area > textarea {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  overflow-y: hidden;
  box-sizing: border-box;
  caret-color: rgb(127, 127, 127);
  color: #000;
  white-space: pre;
  word-wrap: normal;
  border: 0;
  width: 100%;
  height: 100%;
  background: none;
  resize: none;
}
.code-editor .code-area > pre {
  box-sizing: border-box;
  position: relative;
  z-index: 0;
  overflow: hidden;
  font-size: 0;
  margin: 0;
}
.code-editor .code-area > pre > code {
  background: none;
  display: block;
  position: relative;
  overflow-x: visible !important;
  border-radius: 0;
  box-sizing: border-box;
  margin: 0;
}
/* wrap code */
.code-editor.wrap .code-area > textarea,
.code-editor.wrap .code-area > pre > code {
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* scroll */
.code-editor.scroll .code-area {
  height: calc(100% - 34px);
}
.code-editor.scroll .code-area > textarea {
  overflow: auto;
}
.code-editor.scroll .code-area > pre {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
/* dropdown */
.code-editor .list {
  -webkit-user-select: none;
  user-select: none;
  height: 100%;
  font-family: sans-serif;
}
.code-editor .list > .lang-list {
  border-radius: 5px;
  box-sizing: border-box;
  overflow: auto;
  font-size: 13px;
  padding: 0;
  margin: 0;
  list-style: none;
  text-align: left;
}
.code-editor .list > .lang-list > li {
  font-size: 13px;
  transition: background 0.16s ease, color 0.16s ease;
  box-sizing: border-box;
  padding: 0 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 30px;
}
.code-editor .list > .lang-list > li:first-child {
  padding-top: 5px;
}
.code-editor .list > .lang-list > li:last-child {
  padding-bottom: 5px;
}
.code-editor .list > .lang-list > li:hover {
  background: rgba(160, 160, 160, 0.4);
}
/* line-nums */
.code-editor .line-nums {
  min-width: 36px;
  text-align: right;
  box-sizing: border-box;
  position: absolute;
  left: 0;
  padding-right: 8px;
  padding-left: 8px;
  opacity: 0.3;
}
.code-editor .line-nums::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-right: 1px solid currentColor;
  opacity: 0.5;
}
</style>
