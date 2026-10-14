import Image from "next/image";
import styles from "./Footer.module.css";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className="container">
        <div className={styles.footerInner}>
          {/* Brand blurb */}
          <div className={styles.footerBrand}>
            <Image
              src="/logo-mark.png"
              alt="Pezu Standard Medical Concern"
              width={180}
              height={37}
              unoptimized
              className={styles.footerLogo}
            />
            <p className={styles.brandBlurb}>
              Supplying clinics, hospitals, and healthcare professionals with
              reliable medical equipment and consumables.
            </p>
          </div>

          {/* Contact */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Contact</h3>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <span className={styles.contactLabel}>Email</span>
                <a
                  href="mailto:pezustandardmedicsconcerns@gmail.com"
                  className={styles.contactLink}
                >
                  pezustandardmedicsconcerns@gmail.com
                </a>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactLabel}>Phone</span>
                <a href="tel:+2348105117437" className={styles.contactLink}>
                  +234 810 511 7437
                </a>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactLabel}>Addr.</span>
                <span className={styles.contactValue}>
                  24 Alubomimu street, off Imaro Street
                  <br />
                  Idumota, Lagos Island, Nigeria
                </span>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactLabel}>Hours</span>
                <span className={styles.contactValue}>
                  Mon – Sat, Open 24 hours
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {year} Pezu Standard Medical Concern. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            <a href="#privacy">Privacy Policy</a>
            <span className={styles.legalDot} aria-hidden="true">
              ·
            </span>
            <a href="#terms">Terms &amp; Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
