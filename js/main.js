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
        $header.addClass('shadow-md bg-washi/95 dark:bg-[#14110f]/95');
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
  // UTILITY HELPER
  // =========================================================================
  function escapeHtml(text) {
    return $('<div>').text(text).html();
  }

})(jQuery);
