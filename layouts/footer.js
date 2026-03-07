import React from 'react'
import Link from 'next/link'
import { GlobeLock, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
    return (
        <>
            <footer className="techwave_fn_footer">
                <div className="techwave_fn_footer_content">
                    <div className="copyright">
                        <p>2026© Exam Paper Academy</p>
                    </div>
                    <div className="menu_items">
                        <ul>
                            <li><Mail size={20} />: instructor@exampaper.academy </li> 
                            <li><Link href="https://www.linkedin.com/company/exam-paper-academy/"><Linkedin style={{marginTop: -8}} size={20}/> LinkedIn</Link></li>
                            <li><Link href="/privacy"><GlobeLock size={20} style={{marginTop: -5}} />: Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    )
}
