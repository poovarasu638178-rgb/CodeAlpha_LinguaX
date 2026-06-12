/**
 * LinguaX — AI Language Translation Tool
 * Powered by MyMemory Translation API
 */

(function () {
  'use strict';

  const MAX_CHARS = 50000;
  const TOAST_DURATION = 3000;



  const sourceLang     = document.getElementById('source-lang');
  const targetLang     = document.getElementById('target-lang');
  const swapBtn        = document.getElementById('swap-btn');
  const inputText      = document.getElementById('input-text');
  const charCounter    = document.getElementById('char-counter');
  const translateBtn   = document.getElementById('translate-btn');
  const outputText     = document.getElementById('output-text');
  const copyBtn        = document.getElementById('copy-btn');
  const listenBtn      = document.getElementById('listen-btn');
  const toastContainer = document.getElementById('toast-container');
  
  let debounceTimeout;
  let isTranslating = false;

  /* ---- Init ---- */

  function init() {
    loadPreferences();
    setupCustomDropdowns();
    bindEvents();
    updateCharCounter();
    autoResizeTextarea();
    updateTranslateButton();
  }

  function loadPreferences() {
    const savedSource = localStorage.getItem('sourceLang');
    const savedTarget = localStorage.getItem('targetLang');
    if (savedSource) sourceLang.value = savedSource;
    if (savedTarget) targetLang.value = savedTarget;
  }

  function bindEvents() {
    inputText.addEventListener('input', handleInput);
    translateBtn.addEventListener('click', handleTranslate);
    swapBtn.addEventListener('click', handleSwap);
    copyBtn.addEventListener('click', handleCopy);
    listenBtn.addEventListener('click', handleListen);

    sourceLang.addEventListener('change', () => localStorage.setItem('sourceLang', sourceLang.value));
    targetLang.addEventListener('change', () => localStorage.setItem('targetLang', targetLang.value));

    // Keyboard Shortcuts
    document.addEventListener('keydown', function (e) {
      // Cmd/Ctrl + Enter -> Translate
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (!translateBtn.disabled) handleTranslate();
      }
      // Cmd/Ctrl + Shift + C -> Copy
      if (e.key.toLowerCase() === 'c' && e.shiftKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleCopy();
      }
    });
  }

  /* ---- Input handlers ---- */

  function handleInput() {
    updateCharCounter();
    autoResizeTextarea();
    updateTranslateButton();
    
    // Auto-translate (debounced)
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      if (!translateBtn.disabled) handleTranslate();
    }, 600);
  }

  function updateCharCounter() {
    const length = inputText.value.length;
    charCounter.textContent = `${length.toLocaleString()} / ${MAX_CHARS.toLocaleString()}`;
    charCounter.classList.toggle('near-limit', length >= MAX_CHARS * 0.9 && length < MAX_CHARS);
    charCounter.classList.toggle('at-limit', length >= MAX_CHARS);
  }

  function autoResizeTextarea() {
    inputText.style.height = 'auto';
    const minHeight = 140;
    const newHeight = Math.max(minHeight, inputText.scrollHeight);
    inputText.style.height = `${newHeight}px`;
  }

  function updateTranslateButton() {
    const hasText = inputText.value.trim().length > 0;
    translateBtn.disabled = !hasText || isTranslating;
  }

  function handleSwap() {
    const temp = sourceLang.value;
    sourceLang.value = targetLang.value;
    targetLang.value = temp;
    localStorage.setItem('sourceLang', sourceLang.value);
    localStorage.setItem('targetLang', targetLang.value);
    
    // Trigger change to update custom UI
    sourceLang.dispatchEvent(new Event('change'));
    targetLang.dispatchEvent(new Event('change'));
    
    swapBtn.classList.toggle('rotated');
    if (!translateBtn.disabled) handleTranslate();
  }

  /* ---- Translation ---- */

  async function handleTranslate() {
    const text = inputText.value.trim();
    if (!text || isTranslating) return;

    const source = sourceLang.value;
    const target = targetLang.value;

    if (source === target) {
      showToast('Source and target languages must differ.', 'error');
      return;
    }

    // Clear output box before every new translation
    listenBtn.disabled = true;
    outputText.classList.remove('has-result');
    outputText.innerHTML = '<span class="output-placeholder">Translation will appear here...</span>';

    setLoading(true);

    try {
      const translated = await translateChunked(text, source, target);
      displayTranslation(translated);
    } catch {
      showToast('Translation failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }

  // Split big text into sentence-aware chunks of ~1500 chars
  function splitIntoChunks(text, maxLen = 1500) {
    const chunks = [];
    // Split on sentence boundaries first
    const sentences = text.match(/[^.!?\n]+[.!?\n]*/g) || [text];
    let current = '';
    for (const sentence of sentences) {
      if ((current + sentence).length > maxLen && current.length > 0) {
        chunks.push(current.trim());
        current = sentence;
      } else {
        current += sentence;
      }
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks;
  }

  async function translateSingleChunk(text, src, tgt) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${src}&tl=${tgt}&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      const translated = data[0].map(c => c[0]).filter(Boolean).join('');
      if (!translated) throw new Error('Empty response');
      return translated;
    } catch {
      // Fallback to MyMemory
      const fallback = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${src}|${tgt}`
      );
      const fd = await fallback.json();
      if (fd.responseStatus === 200) return fd.responseData.translatedText;
      throw new Error('Both translation engines failed');
    }
  }

  async function translateChunked(text, src, tgt) {
    const chunks = splitIntoChunks(text, 1500);
    const results = [];
    for (const chunk of chunks) {
      const translated = await translateSingleChunk(chunk, src, tgt);
      results.push(translated);
    }
    return results.join(' ');
  }

  /* ---- Display ---- */

  function displayTranslation(text) {
    outputText.classList.add('has-result');
    outputText.innerHTML = `<span class="translation-result">${escapeHtml(text)}</span>`;
    listenBtn.disabled = false;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function setLoading(loading) {
    isTranslating = loading;
    translateBtn.classList.toggle('loading', loading);
    translateBtn.disabled = loading || inputText.value.trim().length === 0;
    if (loading) {
      outputText.innerHTML = '';
      outputText.classList.add('is-loading');
      outputText.classList.remove('has-result');
    } else {
      outputText.classList.remove('is-loading');
    }
  }

  /* ---- Copy ---- */

  async function handleCopy() {
    const resultEl = outputText.querySelector('.translation-result');
    if (!resultEl) return;

    const text = resultEl.textContent;

    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied! ✓', 'success');
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('Copied! ✓', 'success');
    }
  }

  /* ---- Listen (TTS via ElevenLabs Jarvis API) ---- */

  async function handleListen() {
    const resultEl = outputText.querySelector('.translation-result');
    if (!resultEl) return;
    
    const text = resultEl.textContent;
    const lang = targetLang.value;

    // Use ElevenLabs Jarvis for English, local fallback for others
    if (!lang.startsWith('en')) {
      fallbackListen(text, lang);
      return;
    }

    const originalIcon = listenBtn.innerHTML;
    listenBtn.disabled = true;
    listenBtn.style.opacity = '0.5';

    try {
      const apiKey = '7918ac7191e57b114ae9bb4fe19a56ff73f6a55a38f210ce21b0fce4904ec0dc';
      // Callum (N2lVS1w4EtoT3dr4eOWO) is a deep, formal UK male voice perfect for Jarvis
      const voiceId = 'N2lVS1w4EtoT3dr4eOWO'; 
      const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.8,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) throw new Error('ElevenLabs API failed');
      
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      
      // Speed up the voice delivery so Jarvis sounds faster and sharper
      audio.playbackRate = 1.2;
      
      audio.onended = () => {
        listenBtn.disabled = false;
        listenBtn.style.opacity = '1';
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        console.warn('ElevenLabs playback failed, falling back to local TTS.');
        listenBtn.disabled = false;
        listenBtn.style.opacity = '1';
        URL.revokeObjectURL(audioUrl);
        fallbackListen(text, lang);
      };

      await audio.play();
    } catch (e) {
      console.warn('ElevenLabs fetch failed, falling back to local TTS.', e);
      listenBtn.disabled = false;
      listenBtn.style.opacity = '1';
      fallbackListen(text, lang);
    }
  }

  function fallbackListen(text, lang) {
    const synth = window.speechSynthesis;
    synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    
    if (lang.startsWith('en')) {
      const voices = synth.getVoices();
      const bestVoice = voices.find(v => /daniel|brian|uk english male/i.test(v.name)) 
                     || voices.find(v => /male/i.test(v.name));
      if (bestVoice) utterance.voice = bestVoice;
      utterance.pitch = 0.8;
      utterance.rate = 0.95;
    }
    
    synth.speak(utterance);
  }

  /* ---- Custom Dropdowns ---- */

  function setupCustomDropdowns() {
    const selects = document.querySelectorAll('.lang-select');
    
    selects.forEach(select => {
      const wrapper = select.parentElement;
      
      // Create Trigger
      const trigger = document.createElement('div');
      trigger.className = 'custom-select-trigger';
      trigger.innerHTML = `
        <span class="trigger-text">${select.options[select.selectedIndex].text}</span>
        <svg class="dropdown-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
      
      // Create Options Menu
      const optionsMenu = document.createElement('div');
      optionsMenu.className = 'custom-options';
      
      const searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.className = 'dropdown-search';
      searchInput.placeholder = 'Search language...';
      
      const optionsList = document.createElement('div');
      optionsList.className = 'options-list';
      
      Array.from(select.options).forEach(option => {
        const customOpt = document.createElement('div');
        customOpt.className = 'custom-option';
        if (option.selected) customOpt.classList.add('selected');
        
        customOpt.innerHTML = `
          <span class="opt-text">${option.text}</span>
          <svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="opacity: ${option.selected ? '1' : '0'}; color: currentColor;">
            <path d="M5 13L9 17L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
        
        customOpt.addEventListener('click', () => {
          select.value = option.value;
          select.dispatchEvent(new Event('change'));
          optionsMenu.classList.remove('open');
          trigger.classList.remove('active');
          searchInput.value = '';
          Array.from(optionsList.children).forEach(child => child.style.display = 'flex');
        });
        
        optionsList.appendChild(customOpt);
      });
      
      searchInput.addEventListener('input', (e) => {
        const filter = e.target.value.toLowerCase();
        Array.from(optionsList.children).forEach(child => {
          const text = child.querySelector('.opt-text').textContent.toLowerCase();
          child.style.display = text.includes(filter) ? 'flex' : 'none';
        });
      });
      
      // Prevent closing when clicking search
      searchInput.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      
      optionsMenu.appendChild(searchInput);
      optionsMenu.appendChild(optionsList);
      
      wrapper.appendChild(trigger);
      wrapper.appendChild(optionsMenu);
      
      // Toggle dropdown
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = optionsMenu.classList.contains('open');
        // Close all others
        document.querySelectorAll('.custom-options').forEach(m => m.classList.remove('open'));
        document.querySelectorAll('.custom-select-trigger').forEach(t => t.classList.remove('active'));
        
        if (!isOpen) {
          optionsMenu.classList.add('open');
          trigger.classList.add('active');
          searchInput.focus();
        }
      });
      
      // Listen for changes to the native select (like from swap or init)
      select.addEventListener('change', () => {
        const selectedOpt = select.options[select.selectedIndex];
        trigger.querySelector('.trigger-text').textContent = selectedOpt.text;
        
        // Update checkmarks and active states
        Array.from(optionsList.children).forEach((child, index) => {
          const isSelected = select.options[index].selected;
          child.classList.toggle('selected', isSelected);
          child.querySelector('.check-icon').style.opacity = isSelected ? '1' : '0';
        });
      });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
      document.querySelectorAll('.custom-options').forEach(m => m.classList.remove('open'));
      document.querySelectorAll('.custom-select-trigger').forEach(t => t.classList.remove('active'));
    });
  }

  /* ---- Toast ---- */

  function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.classList.add('show');
      });
    });

    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 300);
    }, TOAST_DURATION);
  }

  init();
})();
