import React from "react";
import default_profile from '../../assets/blank-profile.png'

export default function Chat({ contact, user, messages, sendMessage }) {
  return (
    <>
      {contact ? (
        <>
          <div id="chat-messages" style={{ height: "63vh" }} className="overflow-auto px-3 py-2">
          {messages.map((item, index) => (
              <div key={index}>
                <div className={`d-flex py-1 ${item.idSender === user.id ? "justify-content-end": "justify-content-start"}`}>
                  <div style={{ backgroundColor: '#ffffff', padding: '8px', paddingLeft: '15px', paddingRight: '15px', borderRadius: '10px' }} className={ item.idSender === user.id ? "" : ""}>
                    {item.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ height: '6vh', backgroundColor: '#C4C4C4', borderRadius: '10px' }}>
            <input 
              style={{ color: '#000000'}}
              placeholder="Write your message here ..." 
              className="input-message px-4" 
              onKeyPress={sendMessage} />
          </div>
        </>
      ) : (
        <div style={{ height: "63vh" }} className="h4 d-flex justify-content-center align-items-center">
          No Message
        </div>
      )}
    </>
  );
}
