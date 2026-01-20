/** @type {import('svelte/action').Action<HTMLInputElement, { decimals?: number, locale?: string }>} */
export function currency(node, opts = {}) {
  const decimals = opts.decimals ?? 2;
  const locale = opts.locale ?? "en-US";
  const nf = (n) => new Intl.NumberFormat(locale).format(n);

  function unformatNumber(value) {
    if (typeof value !== "string") return value;
    return parseFloat(value.replace(/[^\d.-]/g, ""));
  }

  function sanitizeRaw(value) {
    if (!value) return "";
    let s = value.replace(/[^0-9.]/g, "");
    const parts = s.split(".");
    if (parts.length > 1) s = parts[0] + "." + parts.slice(1).join("");
    return s;
  }

  function formatFromRaw(raw) {
    if (!raw) return "";
    const [intPart, fracPart] = raw.split(".");
    const intFormatted = nf(parseInt(intPart || "0", 10));
    const frac = (fracPart ?? "").slice(0, decimals);
    return frac.length > 0 ? `${intFormatted}.${frac}` : intFormatted;
  }

  function toNumber(raw) {
    if (!raw) return 0;
    const num = parseFloat(raw.replace(/,/g, ""));
    return isNaN(num) ? 0 : num;
  }

  function emitValue(raw) {
    const num = toNumber(raw);
    const formatted = formatFromRaw(raw);
    const prevDisplay = node.value;

    // ⚡ Simpan tampilan sebelumnya
    const display = formatted;

    // ⚙️ Set sementara angka murni biar bind:value dapet number
    node.value = num;

    node.dispatchEvent(new Event("input", { bubbles: true }));

    node.dispatchEvent(
      new CustomEvent("parsedInt", {
        detail: num,
        bubbles: true,
      })
    );

    // 🔙 Kembalikan tampilan formatted di UI
    node.value = display;
    node._numericValue = num;
  }

  let lastRaw = "";
  let typingTimeout;
  let isFocused = false;

  function handleInput(e) {
    const before = String(e.target.value ?? "");
    let raw = before.replace(/[^0-9.]/g, "");

    // hanya boleh 1 titik desimal
    const parts = raw.split(".");
    if (parts.length > 2) {
      raw = parts[0] + "." + parts.slice(1).join("");
    }

    if (raw === ".") raw = "";

    const formatted = formatFromRaw(raw);

    // simpan offset kursor dari kanan
    const start = node.selectionStart;
    const rightOffset = node.value.length - start;
    node.value = formatted;

    const newPos = Math.max(formatted.length - rightOffset, 0);
    try {
      node.setSelectionRange(newPos, newPos);
    } catch {}

    if (raw !== lastRaw) {
      lastRaw = raw;

      // 🔹 kalau mau ada delay (misal user berhenti ngetik 500ms)
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        if (!isFocused) return; // jangan emit kalau masih fokus
        emitValue(raw);
      }, 500);
    }
  }

  function handleBlur(e) {
    isFocused = false;
    // Ambil raw dari current display (could be formatted without decimals)
    const raw = sanitizeRaw(node.value);
    
    if (!raw) {
      node.value = "";
      lastRaw = "";
      return;
    }

    // pastikan fraction lengkap sesuai decimals
    const [intPart, fracPart = ""] = raw.split(".");
    const frac = fracPart.slice(0, decimals).padEnd(decimals, "0");
    const fixed = `${intPart}.${frac}`;

    lastRaw = fixed;
    // format tampilan akhir (ribuan + decimals)
    node.value = formatFromRaw(fixed);
  }

  function handleFocus(e) {
    // simpan posisi caret relatif ke akhir supaya bisa restore
    const caret = node.selectionStart ?? node.value.length;
    isFocused = true;

    const raw = sanitizeRaw(node.value);
    if (!raw) return;

    // kalau sebelumnya ada decimal part, drop it for editing
    // const [intPart] = raw.split(".");
    // node.value = formatFromRaw(intPart);

    // restore caret: tempatkan di akhir dari integer part for simplicity
    try {
      const pos = node.value.length;
      node.setSelectionRange(pos, pos);
    } catch {}
  }

  function handlePaste(e) {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData("text");
    const raw = sanitizeRaw(text);
    lastRaw = raw;
    emitValue(raw);
  }

  node.addEventListener("input", handleInput);
  node.addEventListener("blur", handleBlur);
  node.addEventListener("focus", handleFocus);
  node.addEventListener("paste", handlePaste);

  // ✅ Format nilai awal untuk tampilan saja (tanpa trigger input)
  if (node.value) {
    const raw = sanitizeRaw(node.value.toString());
    const [intPart, fracPart] = raw.split(".");
    const frac = (fracPart ?? "").slice(0, decimals).padEnd(decimals, "0");
    const fixed = `${intPart}.${frac}`;
    lastRaw = fixed;
    node.value = formatFromRaw(fixed); // cuma ubah tampilan, gak ubah bind:value
  }

  return {
    destroy() {
      node.removeEventListener("input", handleInput);
      node.removeEventListener("blur", handleBlur);
      node.removeEventListener("focus", handleFocus);
      node.removeEventListener("paste", handlePaste);
    }
  };
}
