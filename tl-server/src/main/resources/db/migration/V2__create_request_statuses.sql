ALTER TABLE tl_therapist
    DROP CONSTRAINT IF EXISTS tl_therapist_request_status_check;

ALTER TABLE tl_therapist
    ADD CONSTRAINT tl_therapist_request_status_check
        CHECK (request_status >= 0 AND request_status <= 6);