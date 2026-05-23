import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'About Us - The Best Chinese Takeaway In Drogheda',
}

export default function Page() {
    return (
        <>
            <div className="w-full relative">
                <img src="/guo4.jpg" className={'w-full h-[40vw] object-cover'} alt=""/>
                <div className={'absolute top-0 left-0 w-full h-full justify-center items-center flex'}>
                    <h1 className={'text-white text-4xl'}>WE BELIEVE IN THE POWER OF THE WOK</h1>
                </div>
            </div>
            <div className="w-full bg-[#67bfb9] text-white py-10">
                <div className="max-w-350 mx-auto px-4 text-2xl">
                    To turn a humble kitchen into a fiery theatre. And transform the simplest of ingredients into a
                    feast that’s
                    out of this world. Inspired by the hawker food markets of Asia and armed with the mighty wok in all
                    its
                    sizzling hot and smoky glory, our wok chefs take market fresh ingredients and fire them up for that
                    amazing
                    wok-charred flavour, right before your eyes. It’s the taste of Asia in a box, ready when you are.
                    Noodle Box. Wok inspired, market fresh.
                </div>
            </div>
            <div className="w-full relative">
                <img src="/banner-e1602186784250.jpg" className={'w-full h-[40vw] object-cover'} alt=""/>
                <div className={'absolute top-0 left-0 w-full h-full justify-center items-center flex'}>
                    <h1 className={'text-white text-4xl'}>A FIERY START</h1>
                </div>
            </div>
            <div className="w-full bg-[#67bfb9] text-white py-10">
                <div className="max-w-350 mx-auto px-4 text-2xl">
                    In 2010, a young couple from China took their taste buds Come to Drogheda.and the wok-fired flavours
                    of the
                    East Asian food have inspired them ever since. Today, Noodle Box is a neighborhood classic. And you
                    can find
                    us serving up an ever-evolving menu of wok inspired, market fresh creations to hundreds of hungry
                    Noodle
                    Boxers every day.
                </div>
            </div>

            <div className="max-w-350 mx-auto my-10 px-4 md:px-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                    <div className="flex flex-col items-center gap-y-2">
                        <img src="/benson.png" className={'w-[100px] h-[100px] rounded-full object-cover'} alt=""/>
                        <h5 className={'text-center'}>Benson Zhu<br/>DIRECT</h5>
                        <div className={'text-center text-[#ef9d39]'}>
                            Our flame-taming wok chefs work their fiery magic in every Noodle Box kitchen, giving
                            every dish
                            its unforgettable wok-charred flavour.
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-y-2">
                        <img src="/Selina.png" className={'w-[100px] h-[100px] rounded-full object-cover'} alt="" />
                        <h5 className={'text-center'}>Selina Wang<br/>DIRECT</h5>
                        <div className={'text-center text-[#ef9d39]'}>
                            Freshness means flavour, so we use the freshest local market produce we can find to
                            ensure you
                            get maximum crispiness, crunchiness and tastiness in every bit.
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-y-2">
                        <img src="gui.png" className={'w-[100px] h-[100px] rounded-full object-cover'} alt=""/>
                        <h5 className={'text-center'}>Zengui Wang<br/>HEAD CHEF</h5>
                        <div className={'text-center text-[#ef9d39]'}>
                            Crafted from traditional Asian recipes and mastered for modern tastes, our secret sauces
                            add
                            sizzle and scorch to every Noodle Box dish.
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-y-2">
                        <img src="/roisin.png" className={'w-[100px] h-[100px] rounded-full object-cover'} alt=""/>
                        <h5 className={'text-center'}>Roisin Warnett<br/>MANAGER</h5>
                        <div className={'text-center text-[#ef9d39]'}>
                            Our not-so-secret secret weapon, the wok is the key to the distinctively Asian flavours
                            that
                            keep you coming back for more.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}