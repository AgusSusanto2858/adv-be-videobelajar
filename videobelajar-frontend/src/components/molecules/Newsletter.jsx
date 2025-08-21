export default function Newsletter () {
    return (
        <div className="px-4 sm:px-8">
            <div 
            className="flex justify-center items-center w-full h-96 rounded-xl mx-auto max-w-[1170px] mb-16"
            style={{ 
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/images/newsletter.jpg')`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center'
            }}>
                
                <div className="flex flex-col w-full max-w-lg gap-10 px-4">
                    <div className="flex flex-col justify-center gap-1">
                        <p className="font-medium text-lg text-gray-300 text-center">NEWSLETTER</p>
                        <div className="flex flex-col items-center gap-2.5">
                            <h3 className="font-semibold text-2xl md:text-3xl text-white text-center">Mau Belajar Lebih Banyak?</h3>
                            <p className="font-normal text-sm md:text-base text-gray-100 text-center leading-relaxed">
                            Daftarkan dirimu untuk mendapatkan informasi terbaru dan penawaran spesial dari program-program terbaik harisenin.com
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 md:gap-0 md:bg-white md:p-2 md:rounded-lg">
                        <input 
                            type="email" 
                            placeholder="Masukkan Emailmu" 
                            className="w-full md:flex-1 px-4 py-3 font-normal text-base text-gray-600 bg-white border-none outline-none rounded-lg md:rounded-r-none"
                        />
                        <button className="w-full md:w-auto md:px-6 py-3 rounded-lg md:rounded-l-none bg-yellow-400 font-bold text-base text-white hover:bg-yellow-500 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}