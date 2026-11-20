/**
 * MACHI Japanese Kitchen & Matcha
 * Core Interactive Scripts (JavaScript & jQuery 3.7.1)
 * 
 * Features:
 * 1. Toast Notification System (MachiToast)
 * 2. Window Load & Preloader Dismissal
 * 3. Sticky Header Scroll Elevation & Back-To-Top Button
 * 4. Mobile Navigation Drawer Enhancements
 * 5. Menu Live Search & Category Filtering (menu.html)
 * 6. Voucher / Promo Code Copy to Clipboard (promo.html)
 * 7. Table Reservation & Food Order Form WhatsApp Integration (contact.html & menu.html)
 * 8. Interactive Seating & Option Selector
 */

(function ($) {
  'use strict';

  // =========================================================================
  // 1. TOAST NOTIFICATION SYSTEM
  // =========================================================================
  const MachiToast = {
    init: function () {
      if ($('#machi-toast-container').length === 0) {
        $('body').append(`
          <div id="machi-toast-container" 
               class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] flex flex-col items-center gap-2 pointer-events-none w-full max-w-sm px-4"
               aria-live="polite" aria-atomic="true">
          </div>
        `);
      }
    },

    show: function (message, type = 'success', duration = 3200) {
      this.init();

      const icons = {
        success: '🍜',
        info: 'ℹ️',
        promo: '🎟️',
        matcha: '🍵',
        error: '⚠️'
      };

      const icon = icons[type] || '✨';
      const toastId = 'toast-' + Date.now();

      const $toast = $(`
        <div id="${toastId}" 
             class="pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-2xl bg-sumi/95 text-washi dark:bg-washi/95 dark:text-sumi shadow-2xl border border-aka/40 backdrop-blur-md transform transition-all duration-300 translate-y-8 opacity-0 text-xs font-medium">
          <span class="text-base select-none">${icon}</span>
          <span class="flex-1 leading-snug">${message}</span>
          <button type="button" class="toast-close ml-2 text-washi/60 dark:text-sumi/60 hover:text-aka transition" aria-label="Tutup notifikasi">
            ✕
          </button>
        </div>
      `);

      $('#machi-toast-container').append($toast);

      // Trigger enter animation
      requestAnimationFrame(function () {
        $toast.removeClass('translate-y-8 opacity-0').addClass('translate-y-0 opacity-100');
      });

      // Close handler
      $toast.find('.toast-close').on('click', function () {
        MachiToast.dismiss($toast);
      });

      // Auto dismiss
      setTimeout(function () {
        MachiToast.dismiss($toast);
      }, duration);
    },

    dismiss: function ($el) {
      $el.addClass('opacity-0 translate-y-4');
      setTimeout(function () {
        $el.remove();
      }, 300);
    }
  };

  // Expose globally for convenience
  window.MachiToast = MachiToast;


  // =========================================================================
  // 2. DOCUMENT READY ENTRY POINT
  // =========================================================================
  $(function () {
    initPreloader();
    initHeaderAndScroll();
    initMobileNav();
    initPromoCopy();
    initMenuLiveSearch();
    initReservationForm();
    initOrderModalWhatsApp();
    initHeroBentoShowcase();
    initFavoriteToggleFeedback();
    initScrollAnimations();
    initUnifiedOrderCart();
  });


  // =========================================================================
  // 3. PRELOADER DISMISSAL
  // =========================================================================
  function initPreloader() {
    const $preloader = $('#preloader');
    if ($preloader.length === 0) return;

    function dismissPreloader() {
      if (!$preloader.hasClass('dismissed')) {
        $preloader.addClass('dismissed');
        $preloader.fadeOut(400, function () {
          $(this).remove();
        });
        $('body').removeClass('overflow-hidden').css('overflow', '');
      }
    }

    // Dismiss on window load or fallback after 1.8 seconds
    $(window).on('load', function () {
      setTimeout(dismissPreloader, 400);
    });

    setTimeout(dismissPreloader, 1800);
  }


  // =========================================================================
  // 4. STICKY HEADER & BACK-TO-TOP BUTTON
  // =========================================================================
  function initHeaderAndScroll() {
    const $header = $('header');
    const $backToTop = $('a[href="#top"]');

    // Initially configure back-to-top button
    if ($backToTop.length) {
      $backToTop.css({ display: 'none', transition: 'all 0.3s ease' });

      $backToTop.on('click', function (e) {
        e.preventDefault();
        $('html, body').stop().animate({ scrollTop: 0 }, 500, 'swing');
      });
    }

    $(window).on('scroll', function () {
      const scrollPos = $(this).scrollTop();

      // Header shadow elevation
      if (scrollPos > 30) {
        $header.addClass('shadow-md');
      } else {
        $header.removeClass('shadow-md');
      }

      // Back-to-top visibility
      if ($backToTop.length) {
        if (scrollPos > 350) {
          if ($backToTop.is(':hidden')) {
            $backToTop.fadeIn(250);
          }
        } else {
          if ($backToTop.is(':visible')) {
            $backToTop.fadeOut(200);
          }
        }
      }
    });
  }


  // =========================================================================
  // 5. MOBILE DRAWER NAVIGATION ENHANCEMENT
  // =========================================================================
  function initMobileNav() {
    const $drawer = $('#menu-mobile');
    if ($drawer.length === 0) return;

    // Smooth closing when clicking any link inside the mobile drawer
    $drawer.find('a').on('click', function () {
      if (typeof $drawer[0].hidePopover === 'function') {
        try {
          $drawer[0].hidePopover();
        } catch (e) {
          $drawer.removeClass('open');
        }
      } else {
        $drawer.removeClass('open');
      }
    });

    // Close on Escape key press
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (typeof $drawer[0].hidePopover === 'function') {
          try {
            $drawer[0].hidePopover();
          } catch (err) {}
        }
      }
    });
  }


  // =========================================================================
  // 6. PROMO VOUCHER COPY TO CLIPBOARD
  // =========================================================================
  function initPromoCopy() {
    // Target any coupon code or promo card on promo.html
    $('code.select-all, [data-copy-code]').each(function () {
      const $code = $(this);
      $code.attr('title', 'Klik untuk menyalin kode voucher');

      $code.on('click', function () {
        const codeText = $(this).data('copy-code') || $(this).text().trim();
        if (!codeText) return;

        copyToClipboard(codeText, function () {
          MachiToast.show(`Kode promo <strong>${codeText}</strong> berhasil disalin! Silakan gunakan di kasir atau WhatsApp.`, 'promo');

          // Subtle pulse animation
          $code.addClass('ring-2 ring-aka scale-105 transition-transform');
          setTimeout(function () {
            $code.removeClass('ring-2 ring-aka scale-105');
          }, 400);
        });
      });
    });
  }

  function copyToClipboard(text, callback) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(callback).catch(function () {
        fallbackCopyTextToClipboard(text, callback);
      });
    } else {
      fallbackCopyTextToClipboard(text, callback);
    }
  }

  function fallbackCopyTextToClipboard(text, callback) {
    const $temp = $('<textarea>');
    $('body').append($temp);
    $temp.val(text).select();
    try {
      document.execCommand('copy');
      if (typeof callback === 'function') callback();
    } catch (err) {
      console.warn('Gagal menyalin:', err);
    }
    $temp.remove();
  }


  // =========================================================================
  // 7. MENU LIVE SEARCH & CATEGORY FILTERING (menu.html)
  // =========================================================================
  function initMenuLiveSearch() {
    const $menuSections = $('section#ramen, section#sushi, section#sampingan, section#matcha, section#minuman, section#dessert');
    if ($menuSections.length === 0) return;

    // Create live search bar if not already present
    const $categoryNav = $('nav[aria-label="Kategori menu"]');
    if ($categoryNav.length && $('#menu-live-search').length === 0) {
      const searchBarHtml = `
        <div id="menu-live-search" class="mx-auto w-full max-w-screen-2xl px-4 sm:px-8 lg:px-12 xl:px-20 pt-3 pb-1">
          <div class="relative flex items-center max-w-md mx-auto sm:mx-0">
            <span class="absolute left-3.5 text-sumi/40 dark:text-washi/40 select-none text-sm">🔍</span>
            <input type="search" id="menu-search-input" 
                   placeholder="Cari menu, ramen, sushi, matcha..." 
                   class="w-full pl-10 pr-10 py-2 text-xs rounded-full bg-white dark:bg-neutral-800 border border-sumi/20 dark:border-white/15 text-sumi dark:text-washi focus:outline-none focus:ring-2 focus:ring-aka transition shadow-sm"
                   aria-label="Cari menu hidangan Machi">
            <button type="button" id="menu-search-clear" 
                    class="hidden absolute right-3 size-5 rounded-full bg-sumi/10 hover:bg-aka hover:text-white dark:bg-white/10 text-xs flex items-center justify-center transition"
                    aria-label="Bersihkan pencarian">✕</button>
          </div>
          <div id="search-feedback" class="text-[11px] text-sumi/60 dark:text-washi/60 mt-1.5 hidden px-1 font-medium"></div>
        </div>
      `;
      $categoryNav.append(searchBarHtml);
    }

    const $searchInput = $('#menu-search-input');
    const $searchClear = $('#menu-search-clear');
    const $feedback = $('#search-feedback');

    // Filter logic
    $searchInput.on('input', function () {
      const query = $(this).val().toLowerCase().trim();

      if (query.length > 0) {
        $searchClear.removeClass('hidden');
      } else {
        $searchClear.addClass('hidden');
      }

      let totalMatches = 0;
      let totalItems = 0;

      $menuSections.each(function () {
        const $section = $(this);
        const $items = $section.find('ul[role="list"] > li');
        let sectionMatches = 0;

        $items.each(function () {
          totalItems++;
          const $item = $(this);
          const title = $item.find('h3, h4').text().toLowerCase();
          const desc = $item.find('p').text().toLowerCase();
          const badge = $item.find('span, figcaption').text().toLowerCase();

          const isMatch = query === '' || title.includes(query) || desc.includes(query) || badge.includes(query);

          if (isMatch) {
            $item.show();
            sectionMatches++;
            totalMatches++;
          } else {
            $item.hide();
          }
        });

        // Hide or show whole section based on matches
        if (query !== '' && sectionMatches === 0) {
          $section.hide();
        } else {
          $section.show();
        }
      });

      // Feedback count
      if (query !== '') {
        $feedback.removeClass('hidden').html(`Menampilkan <strong>${totalMatches}</strong> hidangan yang sesuai dengan "<em>${escapeHtml(query)}</em>"`);
        if (totalMatches === 0) {
          $feedback.html(`Tidak ditemukan menu dengan kata kunci "<em>${escapeHtml(query)}</em>". <button type="button" id="btn-reset-search" class="text-aka underline font-bold ml-1">Tampilkan semua menu</button>`);
        }
      } else {
        $feedback.addClass('hidden').empty();
      }
    });

    // Clear search button
    $searchClear.on('click', function () {
      $searchInput.val('').trigger('input').focus();
    });

    $(document).on('click', '#btn-reset-search', function () {
      $searchInput.val('').trigger('input');
    });

    // Active Category Pill Navigation
    $categoryNav.find('a[href^="#"]').on('click', function (e) {
      const targetId = $(this).attr('href');
      const $target = $(targetId);

      if ($target.length) {
        e.preventDefault();
        // If search was filtering it out, clear search
        if ($searchInput.val() !== '') {
          $searchInput.val('').trigger('input');
        }

        const offset = $categoryNav.outerHeight() + $('header').outerHeight() + 10;
        $('html, body').animate({
          scrollTop: $target.offset().top - offset
        }, 500);

        // Highlight active pill
        $categoryNav.find('a').removeClass('ring-2 ring-aka');
        $(this).addClass('ring-2 ring-aka');
      }
    });
  }


  // =========================================================================
  // 8. TABLE RESERVATION FORM HANDLER (contact.html)
  // =========================================================================
  function initReservationForm() {
    const $resForm = $('#reservasi form');
    if ($resForm.length === 0) return;

    // Auto set min date to today
    const today = new Date().toISOString().split('T')[0];
    $('#res-date').attr('min', today);

    // Interactive Area Selector Styling
    $('input[name="area"]').on('change', function () {
      $('input[name="area"]').closest('label').removeClass('border-aka ring-1 ring-aka bg-aka/5');
      $(this).closest('label').addClass('border-aka ring-1 ring-aka bg-aka/5');
    });
    // Trigger initial state
    $('input[name="area"]:checked').trigger('change');

    // Handle submission with interactive validation & WhatsApp forwarding
    $resForm.on('submit', function (e) {
      e.preventDefault();

      const name = $('#res-name').val().trim();
      const phone = $('#res-phone').val().trim();
      const email = $('#res-email').val().trim();
      const date = $('#res-date').val();
      const time = $('#res-time').val();
      const guests = $('#res-guests').val();
      const area = $('input[name="area"]:checked').val() || 'indoor';
      const notes = $('#res-notes').val().trim();

      if (!name || name.length < 3) {
        MachiToast.show('Harap isi nama lengkap Anda dengan benar.', 'error');
        $('#res-name').focus();
        return;
      }

      if (!phone || phone.length < 10) {
        MachiToast.show('Harap isi nomor WhatsApp yang valid.', 'error');
        $('#res-phone').focus();
        return;
      }

      if (!date) {
        MachiToast.show('Harap pilih tanggal kedatangan reservasi.', 'error');
        $('#res-date').focus();
        return;
      }

      if (!time) {
        MachiToast.show('Harap tentukan jam santap reservasi.', 'error');
        $('#res-time').focus();
        return;
      }

      // Format date into human readable Indonesian date
      let formattedDate = date;
      try {
        const d = new Date(date);
        formattedDate = d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      } catch (err) {}

      // Area label
      const areaLabels = {
        indoor: 'Indoor Tatami',
        counter: 'Chef Bar Counter',
        'semi-outdoor': 'Semi-Outdoor'
      };

      // Construct WhatsApp Message
      const waMessage = 
`*RESERVASI MEJA — MACHI RAMEN & MATCHA* 🍜
------------------------------------------
👤 *Nama:* ${name}
📱 *WhatsApp:* ${phone}
${email ? `✉️ *Email:* ${email}\n` : ''}📅 *Tanggal:* ${formattedDate}
⏰ *Jam Santap:* ${time}
👥 *Jumlah Tamu:* ${guests}
🪑 *Area Meja:* ${areaLabels[area] || area}
${notes ? `📝 *Catatan Khusus:* ${notes}\n` : ''}------------------------------------------
Mohon konfirmasi ketersediaan meja untuk kami. Terima kasih!`;

      const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(waMessage)}`;

      // Visual feedback button state
      const $submitBtn = $resForm.find('button[type="submit"]');
      const originalText = $submitBtn.html();
      $submitBtn.prop('disabled', true).html('<span>Memproses Reservasi...</span> ⏳');

      setTimeout(function () {
        $submitBtn.prop('disabled', false).html(originalText);
        MachiToast.show('Reservasi terkirim! Mengarahkan ke WhatsApp resmi Machi...', 'success', 3000);
        window.open(waUrl, '_blank');
      }, 600);
    });
  }


  // =========================================================================
  // 9. FOOD ORDER MODAL WHATSAPP INTEGRATION (menu.html)
  // =========================================================================
  function initOrderModalWhatsApp() {
    // Intercept forms inside order popover modals
    $('.menu-modal form').on('submit', function (e) {
      e.preventDefault();
      const $form = $(this);

      const menuName = $form.find('input[name="menu"]').val() || 'Menu Machi';
      const basePrice = $form.find('input[name="harga_dasar"]').val() || '';
      const porsi = $form.find('input[name="jumlah_porsi"]').val() || 1;
      const nama = $form.find('input[name="nama_pemesan"]').val() || '';
      const phone = $form.find('input[name="no_whatsapp"]').val() || '';
      const metode = $form.find('input[name="metode"]:checked').val() || 'ambil';
      const alamat = $form.find('textarea[name="alamat_lengkap"]').val() || '';
      const noMeja = $form.find('input[name="nomor_meja"]').val() || '';
      const levelPedas = $form.find('input[name="pedas"]:checked').val();
      const teksturMi = $form.find('input[name="tekstur_mi"]:checked').val();
      const pembayaran = $form.find('input[name="pembayaran"]:checked').val() || 'tunai';

      if (!nama.trim()) {
        MachiToast.show('Harap isi nama pemesan terlebih dahulu.', 'error');
        $form.find('input[name="nama_pemesan"]').focus();
        return;
      }

      if (!phone.trim()) {
        MachiToast.show('Harap isi nomor WhatsApp Anda.', 'error');
        $form.find('input[name="no_whatsapp"]').focus();
        return;
      }

      const metodeLabels = {
        antar: '🛵 Diantar ke Alamat',
        ambil: '🥡 Ambil di Tempat (Takeaway)',
        meja: '🍜 Makan di Tempat (Dine-in)'
      };

      let waText = 
`*PESANAN MENU — MACHI RAMEN & MATCHA* 🥢
------------------------------------------
🍜 *Menu:* ${menuName} (${porsi} Porsi)
💰 *Harga Satuan:* ${basePrice}
${levelPedas !== undefined ? `🌶️ *Pedas:* Level ${levelPedas}\n` : ''}${teksturMi ? `🍜 *Tekstur Mi:* ${teksturMi}\n` : ''}
👤 *Nama Pemesan:* ${nama}
📱 *No WhatsApp:* ${phone}
📍 *Metode:* ${metodeLabels[metode] || metode}
${metode === 'antar' && alamat ? `🏠 *Alamat Antar:* ${alamat}\n` : ''}${metode === 'meja' && noMeja ? `🪑 *Nomor Meja:* ${noMeja}\n` : ''}💳 *Pembayaran:* ${pembayaran.toUpperCase()}
------------------------------------------
Halo Machi! Mohon konfirmasi pesanan saya.`;

      const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(waText)}`;

      MachiToast.show('Pesanan tercatat! Mengalihkan ke WhatsApp Machi...', 'success');

      // Close modal if popover
      const modal = $form.closest('[popover]')[0];
      if (modal && typeof modal.hidePopover === 'function') {
        try { modal.hidePopover(); } catch (err) {}
      }

      setTimeout(function () {
        window.open(waUrl, '_blank');
      }, 500);
    });
  }


  // =========================================================================
  // 9. HERO INTERACTIVE BENTO SHOWCASE (DRAG & DROP + KEYBOARD SWAP)
  // =========================================================================
  function initHeroBentoShowcase() {
    const $tray = $('#hero-bento-tray');
    if ($tray.length === 0) return;

    const $grid = $('#hero-bento-grid');
    const $title = $('#bento-detail-title');
    const $kanji = $('#bento-detail-kanji');
    const $note = $('#bento-detail-note');
    const $price = $('#bento-detail-price');
    const $cta = $('#bento-detail-cta');
    const $resetBtn = $('#bento-reset-btn');

    const initialOrder = $grid.children('[data-bento-item]').toArray();

    function selectCompartment($btn) {
      $grid.find('[data-bento-item]').attr('aria-pressed', 'false');
      $btn.attr('aria-pressed', 'true');

      $title.text($btn.data('title') || '');
      $kanji.text($btn.data('kanji') || '');
      $note.text($btn.data('note') || '');
      $price.text($btn.data('price') || '');
      if ($btn.data('href')) {
        $cta.attr('href', $btn.data('href'));
      }
    }

    function swapCompartments($a, $b) {
      if (!$a.length || !$b.length || $a[0] === $b[0]) return;

      // Preserve slot grid-span classes so the 12-col bento layout stays balanced
      const spanClasses = ['sm:col-span-7', 'sm:col-span-5', 'sm:min-h-[340px]', 'min-h-[280px]', 'min-h-[200px]', 'min-h-[140px]'];
      const aSpans = spanClasses.filter((c) => $a.hasClass(c));
      const bSpans = spanClasses.filter((c) => $b.hasClass(c));

      spanClasses.forEach((c) => {
        $a.removeClass(c);
        $b.removeClass(c);
      });
      bSpans.forEach((c) => $a.addClass(c));
      aSpans.forEach((c) => $b.addClass(c));

      // Swap DOM positions
      const $placeholder = $('<span>').hide();
      $a.before($placeholder);
      $b.before($a);
      $placeholder.replaceWith($b);

      // Trigger swap pop animation
      $a.removeClass('is-swapped');
      $b.removeClass('is-swapped');
      void $a[0].offsetWidth;
      $a.addClass('is-swapped');
      $b.addClass('is-swapped');
      setTimeout(() => {
        $a.removeClass('is-swapped');
        $b.removeClass('is-swapped');
      }, 340);

      selectCompartment($a);
    }

    // Pointer-based Drag & Drop (works on desktop mouse and touch)
    let dragState = null;

    $grid.on('pointerdown', '[data-bento-item]', function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      const el = this;

      dragState = {
        el,
        $el: $(el),
        startX: e.clientX,
        startY: e.clientY,
        active: false,
        dropTarget: null
      };
    });

    $(document).on('pointermove', function (e) {
      if (!dragState) return;
      const dx = e.clientX - dragState.startX;
      const dy = e.clientY - dragState.startY;

      if (!dragState.active && Math.hypot(dx, dy) > 6) {
        dragState.active = true;
        dragState.$el.addClass('is-dragging');
        if (dragState.el.setPointerCapture && e.pointerId !== undefined) {
          try { dragState.el.setPointerCapture(e.pointerId); } catch (err) {}
        }
      }

      if (!dragState.active) return;

      dragState.$el.css('transform', `translate3d(${dx}px, ${dy}px, 0) scale(1.03) rotate(-1.5deg)`);

      // Detect drop target underneath pointer
      dragState.el.style.pointerEvents = 'none';
      const under = document.elementFromPoint(e.clientX, e.clientY);
      dragState.el.style.pointerEvents = '';

      const targetEl = under ? under.closest('[data-bento-item]') : null;
      $grid.find('.is-drop-target').removeClass('is-drop-target');

      if (targetEl && targetEl !== dragState.el) {
        $(targetEl).addClass('is-drop-target');
        dragState.dropTarget = targetEl;
      } else {
        dragState.dropTarget = null;
      }
    });

    $(document).on('pointerup pointercancel', function () {
      if (!dragState) return;
      const state = dragState;
      dragState = null;

      state.$el.removeClass('is-dragging').css('transform', '');
      $grid.find('.is-drop-target').removeClass('is-drop-target');

      if (state.active) {
        state.$el.data('justDragged', true);
        setTimeout(() => state.$el.data('justDragged', false), 80);

        if (state.dropTarget) {
          swapCompartments(state.$el, $(state.dropTarget));
        }
      }
    });

    // Click / Tap to select compartment
    $grid.on('click', '[data-bento-item]', function () {
      const $btn = $(this);
      if ($btn.data('justDragged')) return;
      selectCompartment($btn);
    });

    // Keyboard Arrow Swap Accessibility (R-32)
    $grid.on('keydown', '[data-bento-item]', function (e) {
      const $items = $grid.children('[data-bento-item]');
      const idx = $items.index(this);
      let targetIdx = -1;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        targetIdx = (idx + 1) % $items.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        targetIdx = (idx - 1 + $items.length) % $items.length;
      }

      if (targetIdx !== -1) {
        e.preventDefault();
        const $current = $(this);
        swapCompartments($current, $items.eq(targetIdx));
        $current.trigger('focus');
      }
    });

    // Reset Susunan Bento
    $resetBtn.on('click', function () {
      const defaultSpans = [
        ['sm:col-span-7', 'min-h-[280px]', 'sm:min-h-[340px]'],
        ['sm:col-span-5', 'min-h-[200px]', 'sm:min-h-[340px]'],
        ['sm:col-span-5', 'min-h-[140px]'],
        ['sm:col-span-7', 'min-h-[140px]']
      ];
      const allSpanClasses = ['sm:col-span-7', 'sm:col-span-5', 'sm:min-h-[340px]', 'min-h-[280px]', 'min-h-[200px]', 'min-h-[140px]'];

      initialOrder.forEach((el, i) => {
        const $el = $(el);
        allSpanClasses.forEach((c) => $el.removeClass(c));
        defaultSpans[i].forEach((c) => $el.addClass(c));
        $grid.append($el);
      });

      selectCompartment($(initialOrder[0]));
      MachiToast.show('Susunan Bento Box dikembalikan ke posisi awal.', 'info', 2000);
    });
  }

  function initFavoriteToggleFeedback() {
    $('.machi-fav-toggle').on('change', function () {
      const dish = $(this).data('dish') || 'Menu';
      if ($(this).is(':checked')) {
        MachiToast.show(`${escapeHtml(dish)} ditambahkan ke favoritmu.`, 'matcha', 2200);
      } else {
        MachiToast.show(`${escapeHtml(dish)} dihapus dari favorit.`, 'info', 2000);
      }
    });
  }


  // =========================================================================
  // 10. EDITORIAL SCROLL-REVEAL, PROGRESS BAR & SUBTLE WATERMARK PARALLAX
  // =========================================================================
  function initScrollAnimations() {
    const $revealEls = $('[data-reveal]');
    const $progressBar = $('#scroll-progress-bar');
    const $watermark = $('#hero-kanji-watermark');
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if ($revealEls.length) {
      if (prefersReduced || !('IntersectionObserver' in window)) {
        $revealEls.addClass('is-visible');
      } else {
        const observer = new IntersectionObserver(
          function (entries, obs) {
            entries.forEach(function (entry) {
              if (!entry.isIntersecting) return;
              const el = entry.target;
              const delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
              if (delay > 0) {
                el.style.transitionDelay = delay + 'ms';
              }
              el.classList.add('is-visible');
              obs.unobserve(el);
            });
          },
          { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        $revealEls.each(function () {
          observer.observe(this);
        });
      }
    }

    if ($progressBar.length || ($watermark.length && !prefersReduced)) {
      let ticking = false;

      function updateOnScroll() {
        const scrollTop = window.scrollY || window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        if ($progressBar.length && docHeight > 0) {
          const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
          $progressBar.css('width', pct.toFixed(2) + '%');
        }

        if ($watermark.length && !prefersReduced && scrollTop < 900) {
          $watermark.css('transform', `translate3d(0, ${(scrollTop * 0.18).toFixed(1)}px, 0)`);
        }

        ticking = false;
      }

      $(window).on('scroll', function () {
        if (!ticking) {
          window.requestAnimationFrame(updateOnScroll);
          ticking = true;
        }
      });

      updateOnScroll();
    }
  }


  // =========================================================================
  // 11. UNIFIED 2-STEP ORDER CART FLOW (MachiCart)
  // =========================================================================
  function initUnifiedOrderCart() {
    const STORAGE_KEY = 'machi_order_cart_v1';

    function loadCart() {
      try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    function saveCart(items) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch {}
    }

    function formatRp(num) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(Number(num) || 0);
    }

    let cart = loadCart();
    let activeStep = 1; // 1 = Daftar Pesanan, 2 = Data & Kirim WA

    // Inject Cart Backdrop, Drawer, and Floating Cart Bar once
    if ($('#machi-cart-drawer').length === 0) {
      $('body').append(`
        <div id="machi-cart-backdrop" aria-hidden="true"></div>
        <aside id="machi-cart-drawer" role="dialog" aria-modal="true" aria-labelledby="machi-cart-title" aria-hidden="true">
          <div class="p-4 sm:p-5 bg-[#191919] text-[#FFF3E8] border-b-2 border-[#191919] flex items-center justify-between gap-3">
            <div>
              <span class="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#E9AC38] block" lang="ja">ご注文 • ALUR PESANAN</span>
              <h2 id="machi-cart-title" class="font-heading font-black text-lg uppercase leading-tight">Keranjang Pesanan</h2>
            </div>
            <button type="button" id="machi-cart-close" class="min-w-[44px] min-h-[44px] rounded-xl border border-white/25 text-white hover:bg-[#D93612] font-bold flex items-center justify-center transition" aria-label="Tutup keranjang pesanan">✕</button>
          </div>

          <div class="p-3.5 bg-[#FFFBF5] border-b-2 border-[#191919]/15 flex gap-2">
            <button type="button" id="cart-tab-1" class="cart-step-pill is-active">1. Cek Menu (<span id="cart-tab-count">0</span>)</button>
            <button type="button" id="cart-tab-2" class="cart-step-pill">2. Data &amp; Konfirmasi</button>
          </div>

          <div class="flex-1 overflow-y-auto p-4 sm:p-5">
            <!-- STEP 1: LIST ITEMS -->
            <div id="cart-step-1">
              <div id="cart-empty-view" class="hidden py-10 px-4 text-center rounded-2xl border-2 border-dashed border-[#191919]/25 bg-white">
                <p class="font-heading font-black text-base text-[#191919]">Keranjang masih kosong</p>
                <p class="text-xs text-[#191919]/70 mt-1 mb-4">Pilih menu ramen, sushi, atau matcha terlebih dahulu untuk mulai memesan.</p>
                <a href="menu.html" class="min-h-[44px] inline-flex items-center px-5 py-2.5 rounded-xl bg-[#D93612] text-white font-heading font-extrabold text-xs border-2 border-[#191919]">Buka Daftar Menu</a>
              </div>
              <div id="cart-receipt-view" class="hidden p-5 rounded-2xl bg-white border-2 border-[#191919] space-y-3 text-left">
                <div class="flex items-center justify-between gap-2 pb-3 border-b-2 border-[#191919]/15">
                  <div>
                    <span class="text-[10px] font-heading font-extrabold uppercase tracking-wider text-[#4F6B22] block">Pesanan Tersimpan</span>
                    <strong id="receipt-order-code" class="font-heading font-black text-xl text-[#191919]">#MCH-0001</strong>
                  </div>
                  <span class="px-2.5 py-1 rounded-md bg-[#E7F3DB] text-[#2B4510] border border-[#4F6B22] text-[10px] font-heading font-extrabold uppercase">DIPROSES</span>
                </div>
                <p id="receipt-summary-text" class="text-xs text-[#191919]/80 leading-relaxed"></p>
                <div class="p-3 rounded-xl bg-[#FFF3E8] border border-[#191919]/20 flex items-center justify-between text-xs">
                  <span class="font-bold text-[#191919]/75">Total Bayar</span>
                  <strong id="receipt-total-amount" class="font-heading font-black text-base text-[#D93612]">Rp 0</strong>
                </div>
                <button type="button" id="btn-receipt-done" class="min-h-[44px] w-full rounded-xl bg-[#20358F] hover:bg-[#191919] text-white font-heading font-extrabold text-xs border-2 border-[#191919] transition">
                  Selesai &amp; Pesan Lagi
                </button>
              </div>
              <ul id="cart-items-list" class="space-y-3"></ul>
            </div>

            <!-- STEP 2: CUSTOMER & METHOD FORM -->
            <form id="cart-checkout-form" class="hidden space-y-3.5 text-xs" novalidate>
              <div class="p-3 rounded-xl bg-white border-2 border-[#191919]/20 flex items-center justify-between">
                <span class="font-bold text-[#191919]/80">Ringkasan (<span id="checkout-item-count">0</span> item)</span>
                <strong id="checkout-total-preview" class="font-heading font-black text-sm text-[#D93612]">Rp 0</strong>
              </div>

              <div>
                <label for="cart-cust-name" class="block font-heading font-extrabold uppercase text-[11px] mb-1 text-[#191919]">Nama Pemesan *</label>
                <input type="text" id="cart-cust-name" class="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white border-2 border-[#191919]/25 text-sm text-[#191919]" placeholder="Contoh: Raka Pratama" required>
              </div>

              <div>
                <label for="cart-cust-phone" class="block font-heading font-extrabold uppercase text-[11px] mb-1 text-[#191919]">Nomor WhatsApp *</label>
                <input type="tel" id="cart-cust-phone" class="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white border-2 border-[#191919]/25 text-sm text-[#191919]" placeholder="0812xxxxxxxx" required>
              </div>

              <div>
                <span class="block font-heading font-extrabold uppercase text-[11px] mb-1.5 text-[#191919]">Cara Pengambilan *</span>
                <div class="grid grid-cols-3 gap-2">
                  <label class="min-h-[44px] flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-white border-2 border-[#191919]/25 cursor-pointer font-bold">
                    <input type="radio" name="cart_method" value="meja" checked> <span>Dine-in</span>
                  </label>
                  <label class="min-h-[44px] flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-white border-2 border-[#191919]/25 cursor-pointer font-bold">
                    <input type="radio" name="cart_method" value="ambil"> <span>Takeaway</span>
                  </label>
                  <label class="min-h-[44px] flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-white border-2 border-[#191919]/25 cursor-pointer font-bold">
                    <input type="radio" name="cart_method" value="antar"> <span>Delivery</span>
                  </label>
                </div>
              </div>

              <div id="cart-field-meja">
                <label for="cart-table-no" class="block font-heading font-extrabold uppercase text-[11px] mb-1 text-[#191919]">Nomor Meja (Opsional)</label>
                <input type="text" id="cart-table-no" class="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white border-2 border-[#191919]/25 text-sm text-[#191919]" placeholder="Contoh: Meja 04 / Counter">
              </div>

              <div id="cart-field-antar" class="hidden">
                <label for="cart-address" class="block font-heading font-extrabold uppercase text-[11px] mb-1 text-[#191919]">Alamat Pengantaran *</label>
                <textarea id="cart-address" rows="2" class="w-full px-3 py-2 rounded-xl bg-white border-2 border-[#191919]/25 text-sm text-[#191919]" placeholder="Jl. Senopati No. ..."></textarea>
              </div>

              <div>
                <label for="cart-payment" class="block font-heading font-extrabold uppercase text-[11px] mb-1 text-[#191919]">Metode Pembayaran</label>
                <select id="cart-payment" class="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white border-2 border-[#191919]/25 text-sm text-[#191919]">
                  <option value="QRIS">QRIS</option>
                  <option value="Transfer Bank">Transfer Bank</option>
                  <option value="Tunai di Kasir">Tunai di Kasir</option>
                </select>
              </div>

              <div>
                <label for="cart-notes" class="block font-heading font-extrabold uppercase text-[11px] mb-1 text-[#191919]">Catatan Pesanan (Opsional)</label>
                <input type="text" id="cart-notes" class="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white border-2 border-[#191919]/25 text-sm text-[#191919]" placeholder="Contoh: Tidak pedas, kurang es">
              </div>
            </form>
          </div>

          <div class="p-4 sm:p-5 bg-[#FFFBF5] border-t-2 border-[#191919] space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-heading font-extrabold uppercase text-[#191919]/75">Total Pesanan</span>
              <strong id="machi-cart-total" class="font-heading font-black text-xl text-[#D93612]">Rp 0</strong>
            </div>
            <div id="cart-footer-step-1" class="flex gap-2">
              <button type="button" id="btn-cart-clear" class="min-h-[44px] px-3.5 py-2.5 rounded-xl border-2 border-[#191919]/30 bg-white hover:bg-[#FFF3E8] text-xs font-heading font-extrabold text-[#191919]">Kosongkan</button>
              <button type="button" id="btn-cart-next" class="min-h-[44px] flex-1 px-4 py-2.5 rounded-xl border-2 border-[#191919] bg-[#D93612] hover:bg-[#191919] text-white text-xs font-heading font-extrabold transition">Lanjut Isi Data</button>
            </div>
            <div id="cart-footer-step-2" class="hidden flex gap-2">
              <button type="button" id="btn-cart-back" class="min-h-[44px] px-4 py-2.5 rounded-xl border-2 border-[#191919] bg-white hover:bg-[#FFF3E8] text-xs font-heading font-extrabold text-[#191919]">Kembali</button>
              <button type="submit" form="cart-checkout-form" id="btn-cart-submit-order" class="min-h-[44px] flex-1 px-4 py-2.5 rounded-xl border-2 border-[#191919] bg-[#20358F] hover:bg-[#191919] text-white text-xs font-heading font-extrabold transition">Konfirmasi &amp; Buat Pesanan</button>
            </div>
          </div>
        </aside>

        <div id="machi-cart-bar" aria-live="polite">
          <div class="min-w-0">
            <span id="cart-bar-summary" class="font-heading font-black text-xs sm:text-sm block truncate">0 Item • Rp 0</span>
            <span class="text-[11px] text-[#FFF3E8]/75">Klik untuk cek &amp; kirim pesanan</span>
          </div>
          <button type="button" id="btn-open-cart-bar" class="min-h-[40px] px-4 py-2 rounded-xl bg-[#E9AC38] hover:bg-[#F5C96B] text-[#191919] font-heading font-black text-xs shrink-0">
            Lihat Pesanan
          </button>
        </div>
      `);
    }

    const $backdrop = $('#machi-cart-backdrop');
    const $drawer = $('#machi-cart-drawer');
    const $bar = $('#machi-cart-bar');

    function getTotalQty() {
      return cart.reduce((sum, item) => sum + item.qty, 0);
    }

    function getTotalPrice() {
      return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    }

    function setStep(step) {
      activeStep = step;
      const isStep1 = step === 1;
      $('#cart-step-1').toggleClass('hidden', !isStep1);
      $('#cart-checkout-form').toggleClass('hidden', isStep1);
      $('#cart-footer-step-1').toggleClass('hidden', !isStep1);
      $('#cart-footer-step-2').toggleClass('hidden', isStep1);
      $('#cart-tab-1').toggleClass('is-active', isStep1);
      $('#cart-tab-2').toggleClass('is-active', !isStep1);
    }

    function renderCart() {
      const totalQty = getTotalQty();
      const totalPrice = getTotalPrice();

      $('#cart-tab-count').text(totalQty);
      $('#checkout-item-count').text(totalQty);
      $('#machi-cart-total').text(formatRp(totalPrice));
      $('#checkout-total-preview').text(formatRp(totalPrice));
      $('#cart-bar-summary').text(`${totalQty} Item • ${formatRp(totalPrice)}`);
      $('.header-cart-badge').text(totalQty).toggleClass('hidden', totalQty === 0);

      if (totalQty > 0) {
        $bar.addClass('is-visible');
        $('#cart-empty-view').addClass('hidden');
        $('#cart-items-list').removeClass('hidden');
        $('#btn-cart-next').prop('disabled', false);
        $('#btn-cart-clear').prop('disabled', false);
      } else {
        $bar.removeClass('is-visible');
        $('#cart-empty-view').removeClass('hidden');
        $('#cart-items-list').addClass('hidden');
        $('#btn-cart-next').prop('disabled', true);
        $('#btn-cart-clear').prop('disabled', true);
        setStep(1);
      }

      const html = cart
        .map(
          (item, idx) => `
          <li class="p-3.5 rounded-xl bg-white border-2 border-[#191919] flex items-center justify-between gap-3">
            <div class="min-w-0 flex-1">
              <strong class="font-heading font-black text-sm text-[#191919] block truncate">${escapeHtml(item.name)}</strong>
              <span class="text-xs font-bold text-[#D93612]">${formatRp(item.price)} × ${item.qty} = ${formatRp(item.price * item.qty)}</span>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <button type="button" class="cart-qty-dec min-w-[34px] min-h-[34px] rounded-lg border-2 border-[#191919] bg-[#FFF3E8] font-black text-sm" data-idx="${idx}" aria-label="Kurangi jumlah ${escapeHtml(item.name)}">-</button>
              <span class="w-6 text-center font-heading font-black text-xs">${item.qty}</span>
              <button type="button" class="cart-qty-inc min-w-[34px] min-h-[34px] rounded-lg border-2 border-[#191919] bg-[#E9AC38] font-black text-sm" data-idx="${idx}" aria-label="Tambah jumlah ${escapeHtml(item.name)}">+</button>
            </div>
          </li>`,
        )
        .join('');

      $('#cart-items-list').html(html);
      saveCart(cart);
    }

    function openCart(step = 1) {
      $('#cart-receipt-view').addClass('hidden');
      renderCart();
      setStep(cart.length > 0 ? step : 1);
      $backdrop.addClass('is-open');
      $drawer.addClass('is-open').attr('aria-hidden', 'false');
    }

    function closeCart() {
      $backdrop.removeClass('is-open');
      $drawer.removeClass('is-open').attr('aria-hidden', 'true');
    }

    function addToCart(name, price) {
      const cleanName = String(name || 'Menu Machi').trim();
      const numericPrice = Number(price) || 0;
      const existing = cart.find((item) => item.name.toLowerCase() === cleanName.toLowerCase());
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name: cleanName, price: numericPrice, qty: 1 });
      }
      renderCart();
      MachiToast.show(`${escapeHtml(cleanName)} masuk ke keranjang pesanan.`, 'success', 2400);
    }

    // Intercept single-item order popovers on menu.html -> route into unified cart!
    $(document).on('click', 'button[popovertarget^="pesan-"]', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const $btn = $(this);
      const $card = $btn.closest('article, .rounded-3xl, section');
      const name = $card.find('h3').first().text().trim() || 'Menu Machi';
      const priceAttr = $card.find('data[value]').first().attr('value');
      const price = priceAttr ? Number(priceAttr) : 0;
      addToCart(name, price);
    });

    // Support explicit [data-add-cart] buttons (index.html popular/quiz items)
    $(document).on('click', '[data-add-cart]', function (e) {
      e.preventDefault();
      const $btn = $(this);
      addToCart($btn.data('name'), $btn.data('price'));
      if ($btn.data('open-cart')) {
        openCart(1);
      }
    });

    // Open cart from header trigger or floating bar
    $(document).on('click', '#btn-open-cart-bar, [data-open-cart-drawer]', function (e) {
      e.preventDefault();
      openCart(1);
    });

    $('#machi-cart-close, #machi-cart-backdrop').on('click', closeCart);

    $('#cart-tab-1, #btn-cart-back').on('click', () => setStep(1));
    $('#cart-tab-2, #btn-cart-next').on('click', () => {
      if (cart.length === 0) {
        MachiToast.show('Tambahkan minimal 1 menu terlebih dahulu.', 'info');
        return;
      }
      setStep(2);
      $('#cart-cust-name').focus();
    });

    $('#btn-cart-clear').on('click', function () {
      cart = [];
      renderCart();
      MachiToast.show('Keranjang pesanan dikosongkan.', 'info', 2000);
    });

    $('#cart-items-list').on('click', '.cart-qty-inc', function () {
      const idx = Number($(this).data('idx'));
      if (cart[idx]) {
        cart[idx].qty += 1;
        renderCart();
      }
    });

    $('#cart-items-list').on('click', '.cart-qty-dec', function () {
      const idx = Number($(this).data('idx'));
      if (cart[idx]) {
        cart[idx].qty -= 1;
        if (cart[idx].qty <= 0) cart.splice(idx, 1);
        renderCart();
      }
    });

    $('input[name="cart_method"]').on('change', function () {
      const val = $(this).val();
      $('#cart-field-meja').toggleClass('hidden', val !== 'meja');
      $('#cart-field-antar').toggleClass('hidden', val !== 'antar');
    });

    $('#btn-receipt-done').on('click', function () {
      $('#cart-receipt-view').addClass('hidden');
      renderCart();
      closeCart();
    });

    $('#cart-checkout-form').on('submit', async function (e) {
      e.preventDefault();
      if (cart.length === 0) {
        MachiToast.show('Keranjang pesanan masih kosong.', 'error');
        setStep(1);
        return;
      }

      const customerName = $('#cart-cust-name').val().trim();
      const phone = $('#cart-cust-phone').val().trim();
      const method = $('input[name="cart_method"]:checked').val() || 'meja';
      const tableNo = $('#cart-table-no').val().trim();
      const address = $('#cart-address').val().trim();
      const paymentMethod = $('#cart-payment').val() || 'QRIS';
      const notes = $('#cart-notes').val().trim();

      if (!customerName || customerName.length < 2) {
        MachiToast.show('Harap isi Nama Pemesan minimal 2 karakter.', 'error');
        $('#cart-cust-name').focus();
        return;
      }
      if (!phone || phone.length < 8) {
        MachiToast.show('Harap isi Nomor Telepon/WhatsApp minimal 8 digit.', 'error');
        $('#cart-cust-phone').focus();
        return;
      }
      if (method === 'antar' && !address) {
        MachiToast.show('Harap isi Alamat Pengantaran untuk metode Delivery.', 'error');
        $('#cart-address').focus();
        return;
      }

      const $submitBtn = $('#btn-cart-submit-order');
      const originalText = $submitBtn.text();
      $submitBtn.prop('disabled', true).text('Menyimpan Pesanan...');

      try {
        const response = await fetch('http://localhost:3000/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            customerName,
            phone,
            method,
            tableNo: method === 'meja' && tableNo ? tableNo : undefined,
            address: method === 'antar' && address ? address : undefined,
            paymentMethod,
            notes: notes || undefined,
            items: cart.map((item) => ({
              name: item.name,
              price: item.price,
              qty: item.qty,
            })),
          }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          const msg =
            data && Array.isArray(data.message)
              ? data.message[0]
              : data && data.message
                ? data.message
                : `Gagal menyimpan pesanan (HTTP ${response.status}).`;
          MachiToast.show(msg, 'error', 4000);
          return;
        }

        // Order saved successfully to NestJS backend + orders.json
        cart = [];
        saveCart(cart);
        $('#cart-checkout-form')[0].reset();
        $('#cart-field-meja').removeClass('hidden');
        $('#cart-field-antar').addClass('hidden');

        renderCart();
        $('#cart-empty-view').addClass('hidden');
        $('#receipt-order-code').text(`#${data.orderCode}`);
        $('#receipt-total-amount').text(formatRp(data.totalAmount));
        $('#receipt-summary-text').text(
          `Terima kasih ${data.customerName}! Pesanan Anda (${data.items.length} jenis menu, pembayaran ${data.paymentMethod}) telah tersimpan ke server Machi dan sedang diproses dapur.`,
        );
        $('#cart-receipt-view').removeClass('hidden');

        MachiToast.show(
          `Pesanan #${data.orderCode} berhasil masuk! Total ${formatRp(data.totalAmount)}.`,
          'success',
          4500,
        );
      } catch {
        MachiToast.show(
          'Gagal terhubung ke backend (http://localhost:3000/orders). Pastikan server NestJS sedang berjalan.',
          'error',
          4500,
        );
      } finally {
        $submitBtn.prop('disabled', false).text(originalText);
      }
    });

    $(document).on('keydown', function (e) {
      if (e.key === 'Escape' && $drawer.hasClass('is-open')) {
        closeCart();
      }
    });

    renderCart();
  }


  // =========================================================================
  // UTILITY HELPER
  // =========================================================================
  function escapeHtml(text) {
    return $('<div>').text(text).html();
  }

})(jQuery);
