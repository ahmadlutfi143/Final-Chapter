import React from "react";
import default_profile from "../../assets/blank-profile.png"

export default function Contact({ dataContact, clickContact, contact }) {

  return (
    <>
      {dataContact.length > 0 && (
        <>
          {dataContact.map((item) => (
            <div style={{ color: '#000000', backgroundColor: '#C4C4C4' }}
              key={item.id}
              className={`contact mt-1 p-2 ${
                contact?.id === item?.id && "contact-active"
              }`}
              onClick={() => {
                clickContact(item);
              }}
            >
              <img
                src={item.profile?.image || default_profile}
                className="rounded-circle me-2 img-contact"
                alt="user avatar"
              />
              <div className="ps-1 text-contact d-flex flex-column justify-content-around">
                <p className="mb-0">{item.name}</p>
                
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}
