function copyViaExecCommand(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  try {
    return document.execCommand("copy");
  } finally {
    textarea.remove();
    window.getSelection()?.removeAllRanges();
  }
}

export async function copyPlainText(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the legacy path when the async API is denied.
    }
  }

  return copyViaExecCommand(text);
}

function copyExactHtml(container: HTMLElement): boolean {
  const selection = window.getSelection();
  if (!selection) return false;

  const previousRanges = Array.from({ length: selection.rangeCount }, (_, index) =>
    selection.getRangeAt(index).cloneRange(),
  );
  const html = container.innerHTML;
  const text = container.innerText || container.textContent || "";
  let copied = false;

  const handleCopy = (event: Event) => {
    const clipboardEvent = event as ClipboardEvent;
    if (!clipboardEvent.clipboardData) return;
    try {
      clipboardEvent.clipboardData.setData("text/html", html);
      clipboardEvent.clipboardData.setData("text/plain", text);
      clipboardEvent.preventDefault();
      copied = true;
    } catch {
      copied = false;
    }
  };

  document.addEventListener("copy", handleCopy, true);

  try {
    const range = document.createRange();
    range.selectNodeContents(container);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    return copied;
  } catch {
    return false;
  } finally {
    document.removeEventListener("copy", handleCopy, true);
    selection.removeAllRanges();
    previousRanges.forEach((previous) => {
      try {
        selection.addRange(previous);
      } catch {
        // Ignore detached ranges from the previous editor state.
      }
    });
  }
}

export async function copyRichHtml(container: HTMLElement): Promise<boolean> {
  if (copyExactHtml(container)) return true;

  if (navigator.clipboard && window.ClipboardItem) {
    try {
      const html = new Blob([container.innerHTML], { type: "text/html" });
      const text = new Blob([container.innerText || container.textContent || ""], {
        type: "text/plain",
      });
      await navigator.clipboard.write([
        new ClipboardItem({ "text/html": html, "text/plain": text }),
      ]);
      return true;
    } catch {
      return false;
    }
  }

  return false;
}
