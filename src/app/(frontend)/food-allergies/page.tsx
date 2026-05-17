import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Food Allergies - The Best Chinese Takeaway In Drogheda",
};

export default async function page() {
    return (
        <>
            <div className="w-full">
                <img src="/rmixvP3ywRWRlvWHPOGVNyilUlCtOoM6l8CGwvJ9.jpg" className={'w-full object-cover h-[24vw]'}
                     alt=""/>
            </div>
            <div className={'max-w-350 mx-auto px-4 md:px-0 py-6 text-[#f19e39]'}>
                <div>
                    <h1 className={'text-3xl font-bold text-center'}>Food Allergies</h1>
                    <p className={'text-center my-2 text-[#feff55]'}>
                        Please ask our staff on Tel: 041 984 5775 for
                        allergy advice if you create your own dish！！！！！
                    </p>
                    <p className={'py-4'}>
                        Food allergy is an increasing problem in western countries, with strict avoidance being the only
                        available reliable treatment. However, accidental ingestion can occur and anaphylactic reactions
                        still
                        happen so please be aware of who you are ordering for in group or family at all times. We pride
                        ourselves in caring for you and provide and can prepare to the strictest standards. The most
                        common
                        type
                        of food allergy in adults involves tingling and swelling in and around your mouth, and it’s
                        triggered by
                        fruits and vegetables, not peanuts, tree nuts, or even shellfish. Although peanut and nut
                        allergies
                        tend
                        to get the most attention, you’re actually more likely to be allergic to nectarines and apples
                        than
                        you
                        are to the best-known allergens. These reactions to fruits and vegetables stem from what’s
                        called
                        oral
                        allergy syndrome (OAS). When you have oral allergy syndrome, you begin to react to foods that
                        are
                        related to allergenic pollen’s
                    </p>
                    <p className={'py-4 text-center text-[#feff55] font-bold'}>
                        Please look out for these Allergy logos under each product,scroll down the page.
                    </p>
                    <p className={'py-4 text-center'}>
                        <a className={'bg-[#be2e2d] text-white text-2xl'}>
                            NEW Noodle Box Drogheda ALLERGEN LIST 2019.pdf
                        </a>
                    </p>
                </div>

                <div className={'my-10'}>
                    <p className={'py-2 text-[#feff55]'}>
                        Sesame allergies may not receive as much publicity as peanut allergies, but the reactions can be
                        just as serious. Allergic reactions to sesame seeds or sesame oil can cause anaphylaxis. An
                        anaphylactic reaction occurs when your body’s immune system releases high levels of certain
                        potent
                        chemicals.
                    </p>
                    <p className={'py-2'}>
                        Wheat * gluten allergies, like hay fever and other allergies, develop when the body’s immune
                        system
                        becomes sensitized and overreacts to something in the environment, in this case, wheat that
                        typically causes no problem in most people.
                    </p>
                    <p className={'py-2 text-[#feff55]'}>
                        Eggs are one of the most common allergy-causing foods for children. Egg allergy symptomsusually
                        occur a few minutes to a few hours after eating eggs or foods containing eggs. Signs and
                        symptoms
                        range from mild to severe and can include skin rashes, hives, nasal congestion, and vomiting or
                        other digestive problems.
                    </p>
                    <p className={'py-2 text-[#feff55]'}>
                        People with a milk or dairy allergy experience symptoms because their immune system reacts as
                        though
                        milk and other dairy products are a dangerous invader. This reaction can cause hives, an upset
                        stomach, vomiting, bloody stools and even anaphylactic shock — a life-threatening allergic
                        response.
                    </p>
                    <p className={'py-2'}>
                        Chicken allergy reaction : Chicken allergies aren’t common, but they can cause uncomfortable or
                        even
                        dangerous symptoms in some people. … You might also become allergic to live chickens or to
                        chicken
                        meat after many years of having no allergic reactions. Some people with chicken allergy are
                        allergic
                        to raw but not cooked chicken.
                    </p>
                    <p className={'py-2'}>
                        Fish Allergies. As with other food allergies, the symptoms of a fish allergy may range from mild
                        to
                        severe. They include: Hives or a skin rash. Nausea, stomach cramps, indigestion, vomiting and/or
                        diarrhea
                    </p>
                    <p className={'py-2 text-[#feff55]'}>
                        Peanut allergy is a type of food allergy to peanuts. It is different from tree nut
                        allergies.Physical symptoms of allergic reaction can include itchiness, hives, swelling, eczema,
                        sneezing,asthma,abdominal pain,drop in blood pressure, diarrhea, and cardiac arrest
                    </p>
                    <p className={'py-2'}>
                        The Spice factor Please notice, each spice image listed under each product we offer. The
                        following
                        spice pictures indicate the following spice heat and if you are a not spice palette, then we
                        suggest
                        go for no spice or a low spice to start off enjoying our dishes.
                    </p>
                    <div className={'flex'}>
                        <img
                            className={'h-20'}
                            src="https://noodlebox.ie/storage/image/2024/03/Q87f3f0EVaMt8PeLQBLtuzPKMWHJO8uznTir7KnG.png"
                            alt=""/>
                        <img
                            className={'h-20'}
                            src="https://noodlebox.ie/storage/image/2024/03/KJqTGS4O6XDrEFjifIlMYbawal5owdA0hdfLCsdT.png"
                            alt=""/>
                        <img
                            className={'h-20'}
                            src="https://noodlebox.ie/storage/image/2024/03/5wZCq0oF5EB57p2Ivq1CvCNtxmD53SnlW8VR33Pv.png"
                            alt=""/>
                    </div>
                    <p className={'py-2'}>
                        If in doubt ? ASK ALWAYS PLEASE, ABOUT OUR Ingredients and do not hesitate to call us to obtain
                        strictest dietary needs for every dish we provide.
                    </p>
                </div>
            </div>
        </>
    )
}