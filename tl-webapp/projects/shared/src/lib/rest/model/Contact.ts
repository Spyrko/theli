import { ContactType } from "./ContactType";

export interface Contact {
         /**
          * Unique identifier for the contact.
          */
         id?: number;

         /**
          * Type of the contact (e.g., email, phone, etc.).
          */
         type: ContactType;

         /**
          * Content of the contact (e.g., message, email body, etc.).
          */
         content: string;

         /**
          * Date of the contact.
          */
         date: Date;
     }
