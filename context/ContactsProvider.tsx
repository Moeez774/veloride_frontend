'use client'
import { createContext, useState, useContext, useEffect, Dispatch, SetStateAction } from "react";
import { ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import socket from "@/utils/socket";
import { usePathname } from "next/navigation";

const ContactsContext = createContext<{ contacts: any[], matchedRides: any, setMatchedRides: Dispatch<SetStateAction<any>>, fetchContacts: () => void } | null>(null);


export const ContactsProvider = ({ children }: { children: ReactNode }) => {
  const [contacts, setContacts] = useState<any[]>([])
  const [matchedRides, setMatchedRides] = useState<any>()
  const authContext = useAuth()
  const user = authContext?.user || null
  const pathname = usePathname()

  const fetchContacts = async () => {
    try {
      let a = await fetch('http://localhost:4000/messages/all-contacts', {
        method: "POST", headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_id: user?._id })
      })

      let response = await a.json()
      if (response.statusCode === 200) {
        setContacts(response.data)
      }
    } catch (err) {
      console.log("Error in fetching contacts: " + err)
    }
  }

  //fethcing contacts of user
  useEffect(() => {
    if (!user) return
    fetchContacts()
  }, [user])

  useEffect(() => {
    if (pathname.startsWith('/chats')) document.body.style.overflowY = 'hidden'
    else document.body.style.overflowY = 'auto'
  }, [pathname])

  useEffect(() => {
    if (!user) return
    //emitting join rooms on site load for joining chat's rooms quickly
    user.contacts.forEach((contact: any) => {
      socket.emit("joinRoom", contact.chat_id)
    })
  }, [user, contacts])

  //for adding contacts in realtime
  useEffect(() => {
    const addContact = (data: any) => {
      if (data.receiver_id === user?._id || data.sender_id === user?._id) {
        fetchContacts()
        socket.emit("joinRoom", data.chat_id)
      }
    }

    socket.on("add-contact", addContact)

    return () => {
      socket.off("add-contact", addContact)
    }
  }, [user])

  return (
    <ContactsContext.Provider value={{ contacts, matchedRides, setMatchedRides, fetchContacts }}>
      {children}
    </ContactsContext.Provider>
  );
};

export const getContacts = () => useContext(ContactsContext);
