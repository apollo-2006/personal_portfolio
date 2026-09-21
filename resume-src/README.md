# Resume source

`resume.html` is the source for `public/abir-deol-resume.pdf`. Edit the HTML, then
regenerate the PDF with headless Chrome:

    google-chrome-stable --headless --disable-gpu --no-pdf-header-footer \
      --print-to-pdf=../public/abir-deol-resume.pdf resume.html

It is laid out to fit exactly one letter page. After any edit, check the page count
before committing:

    pdftoppm -png -r 80 ../public/abir-deol-resume.pdf /tmp/pg && ls /tmp/pg*

If a second page appears, cut text rather than shrinking the type further: the body
is already at 8.55pt.
