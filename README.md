# Gerçek Zamanlı Sohbet Uygulaması

Bu proje, Vite, React, TypeScript ve Firebase kullanılarak oluşturulmuş gerçek zamanlı bir sohbet uygulamasıdır.

## Kurulum ve Başlatma

1.  **Node.js'i Yükleyin:** Eğer yüklü değilse, [Node.js resmi sitesinden](https://nodejs.org/) LTS sürümünü indirin ve kurun.
2.  **Bağımlılıkları Yükleyin:** Proje klasöründe bir terminal açın ve aşağıdaki komutu çalıştırın:
    ```bash
    npm install
    ```
3.  **Uygulamayı Yerelde Çalıştırın:** Geliştirme sunucusunu başlatmak için aşağıdaki komutu çalıştırın:
    ```bash
    npm run dev
    ```
    Tarayıcınızda `http://localhost:5173` (veya terminalde belirtilen adres) açılarak uygulamayı görebilirsiniz.

## GitHub Pages'te Yayınlama

1.  **GitHub'da Yeni Bir Depo (Repository) Oluşturun:** Projeniz için GitHub'da boş bir depo oluşturun.

2.  **`package.json` Dosyasını Güncelleyin:** `package.json` dosyasını açın ve `homepage` alanını kendi GitHub kullanıcı adınız ve depo adınızla güncelleyin:
    ```json
    "homepage": "https://<KULLANICI_ADINIZ>.github.io/<DEPO_ADINIZ>/",
    ```

3.  **`vite.config.ts` Dosyasını Güncelleyin:** `vite.config.ts` dosyasını açın ve `base` alanını depo adınızla güncelleyin:
    ```typescript
    base: '/<DEPO_ADINIZ>/',
    ```

4.  **Projeyi GitHub'a Yükleyin:** Aşağıdaki komutları sırasıyla çalıştırarak projenizi GitHub'a yükleyin (`<KULLANICI_ADINIZ>` ve `<DEPO_ADINIZ>` kısımlarını kendi bilgilerinizle değiştirin):
    ```bash
    git init
    git add .
    git commit -m "İlk proje kurulumu"
    git branch -M main
    git remote add origin https://github.com/<KULLANICI_ADINIZ>/<DEPO_ADINIZ>.git
    git push -u origin main
    ```

5.  **Uygulamayı Yayınlayın:** Projenizi derleyip GitHub Pages'e göndermek için aşağıdaki komutu çalıştırın:
    ```bash
    npm run deploy
    ```
    Bu komut, projenizi `dist` klasörüne derleyecek ve bu klasörün içeriğini deponuzdaki `gh-pages` branch'ine gönderecektir.

6.  **GitHub Pages Ayarlarını Kontrol Edin:**
    *   GitHub deponuza gidin.
    *   **Settings** > **Pages** sekmesine tıklayın.
    *   "Build and deployment" bölümünde, kaynak (Source) olarak **`gh-pages`** branch'inin ve **`/(root)`** klasörünün seçili olduğundan emin olun.

Birkaç dakika içinde uygulamanız `homepage` adresinde canlıya alınacaktır!
