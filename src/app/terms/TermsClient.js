import { TERMS_SECTIONS } from "./termsData";
import styles from "./terms.module.css";

export default function TermsClient() {
  return (
    <div className={styles.pageWrap}>
      <div className={styles.inner}>

        {/* ── Page Header: Heading Only ── */}
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Terms and Condition</h1>
        </header>

        {/* ── Flat & Clean Document Container ── */}
        <div className={styles.docCard}>
          {TERMS_SECTIONS.map((sec, idx) => (
            <section
              key={sec.id}
              id={sec.id}
              className={`${styles.section} ${idx < TERMS_SECTIONS.length - 1 ? styles.sectionDivider : ""}`}
            >
              {/* Section Heading: Flat text */}
              <h2 className={styles.secTitle}>
                {parseInt(sec.num, 10)}. {sec.title}
              </h2>

              {/* Body Content */}
              <div className={styles.secBody}>
                {sec.paragraphs?.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}

                {sec.list && (
                  <ul className={styles.secList}>
                    {sec.list.map((item, i) => (
                      <li key={i} className={styles.secListItem}>
                        <span className={styles.listAlpha}>({String.fromCharCode(97 + i)})</span>
                        <span className={styles.listText}>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {sec.afterParagraphs?.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}

                {/* Section 21 — Flat and Clean Contact Details List */}
                {sec.isContactCard && sec.contactInfo && (
                  <ul className={styles.contactList}>
                    <li>
                      <strong>Legal Company Name:</strong>{" "}
                      <span>{sec.contactInfo.companyName}</span>
                    </li>
                    <li>
                      <strong>Registered Address:</strong>{" "}
                      <span>{sec.contactInfo.address}</span>
                    </li>
                    <li>
                      <strong>Customer Support Email:</strong>{" "}
                      <a href={`mailto:${sec.contactInfo.email}`} className={styles.link}>
                        {sec.contactInfo.email}
                      </a>
                    </li>
                    <li>
                      <strong>Telephone:</strong>{" "}
                      <a href={`tel:${sec.contactInfo.phone}`} className={styles.link}>
                        {sec.contactInfo.phone}
                      </a>
                    </li>
                    <li>
                      <strong>Website:</strong>{" "}
                      <a
                        href={sec.contactInfo.website || "https://www.pezustandardmedics.com/"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                      >
                        {sec.contactInfo.website || "https://www.pezustandardmedics.com/"}
                      </a>
                    </li>
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>

      </div>
    </div>
  );
}
