import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageLoader() {
    const [show, setShow] = useState(true);

    useEffect(() => {
        // El loader durará 2.2 segundos
        const timer = setTimeout(() => setShow(false), 2200);
        return () => clearTimeout(timer);
    }, []);

    // Bloquea el scroll mientras carga
    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [show]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    key="page-loader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed inset-0 z-[99999] bg-roma-olive flex flex-col items-center justify-center"
                >
                    <div className="relative w-28 md:w-36">
                        {/* Logo de base (Marca de agua) */}
                        <img src="/roma-logo.png" alt="Cargando base" className="w-full h-auto opacity-[0.08]" />

                        {/* Logo que se revela (SIN brillos ni bordes blancos) */}
                        <motion.div
                            className="absolute inset-y-0 left-0 overflow-hidden"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                        >
                            <img src="/roma-logo.png" alt="Roma" className="w-28 md:w-36 max-w-none h-auto" />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}