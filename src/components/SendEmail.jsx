import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import styles from './sendemail.module.css';

const SendEmail = () => {
  const form = useRef();
  const [message, setMessage] = useState(`Dear Student,

We hope this message finds you well.

We are excited to invite you to become a part of the Fast Gaming Society! As a vibrant community dedicated to gaming enthusiasts, we offer a range of activities, events, and opportunities for you to connect with fellow gamers, develop your skills, and participate in exciting competitions.

Why Join Us?

Engaging Events: Participate in our regular gaming tournaments, workshops, and social gatherings.
Exclusive Access: Gain access to members-only content, early game releases, and more.
Community: Connect with like-minded individuals who share your passion for gaming.
Growth Opportunities: Improve your gaming skills and collaborate on projects with other members.
To join the Fast Gaming Society, please complete your registration by following the link below:

http://localhost:5173/register

We look forward to welcoming you to our community and sharing our passion for gaming with you!

If you have any questions or need further information, feel free to reach out to us at 

Best regards,

Best wishes,
Fast Gaming Society`);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_knnhxz9", "template_djbavuw", form.current, "eY-nf6zG8F1_3rJ6_")
      .then(
        () => {
          console.log("SUCCESS!");
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };

  return (
    <div className={styles.emailFormContainer}>
      <div className={styles.emailHeader}>
        <h2>Send Invitation Email</h2>
      </div>
      <form ref={form} onSubmit={sendEmail} className={styles.emailForm}>
        <label className={styles.label}>Name</label>
        <input type="text" name="user_name" className={styles.input1} />
        <label className={styles.label}>Recipient Email</label>
        <input type="email" name="recipient_email" className={styles.input1} />
        <label className={styles.label}>Message</label>
        <textarea name="message" value={message} onChange={(e) => setMessage(e.target.value)} className={styles.textarea1} />
        <button type="submit" className={styles.button}>Send</button>
      </form>
    </div>
  );
};

export default SendEmail;
