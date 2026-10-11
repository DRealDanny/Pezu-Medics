import styles from "./Footer.module.css";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container`}>
        <div className={styles.footerInner}>
          {/* Brand blurb */}
          <div className={styles.footerBrand}>
            <p className={styles.brandName}>Pezu Medics</p>
            <p>
              Supplying clinics, hospitals, and healthcare professionals with
              reliable medical equipment and consumables since 2010.
            </p>
          </div>

          {/* Contact */}
          <div className={styles.footerSection}>
            <h3>Contact</h3>
            <ul>
              <li className={styles.contactItem}>
                <span className={styles.contactLabel}>Email</span>
                <span>info@pezumedics.com.ng</span>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactLabel}>Phone</span>
                <span>+234 (0) 800 000 0000</span>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactLabel}>Addr.</span>
                <span>
                  14 Marina Street, Lagos
                  <br />
                  Lagos Island, Nigeria
                </span>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactLabel}>Hours</span>
                <span>Mon – Fri, 08:00 – 17:00 WAT</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.footerBottom}>
          <p>© {year} Pezu Medics Ltd. All rights reserved.</p>
          <p>Privacy Policy · Terms &amp; Conditions</p>
        </div>
      </div>
    </footer>
  );
}
