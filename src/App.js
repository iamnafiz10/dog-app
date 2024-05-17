import './App.css';
import LogoImg from '../src/assets/images/logo.png';
import DogImg from '../src/assets/images/dog.png';
import {useEffect, useState} from "react";

function App() {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [breeds, setBreeds] = useState([]);
    const [selectedBreed, setSelectedBreed] = useState(null);

    useEffect(() => {
        fetch('https://dogapi.dog/api/v2/groups')
            .then(response => response.json())
            .then(data => {
                setGroups(data.data);
            })
            .catch(error => console.error('Error fetching groups:', error));
    }, []);

    const handleGroupClick = (group) => {
        setSelectedGroup(group);
        fetchBreeds(group.relationships.breeds.data.map(breed => breed.id));
    };

    const fetchBreeds = (breedIds) => {
        const breedFetches = breedIds.map(id =>
            fetch(`https://dogapi.dog/api/v2/breeds/${id}`)
                .then(response => response.json())
                .then(data => data.data)
        );
        Promise.all(breedFetches)
            .then(breeds => setBreeds(breeds))
            .catch(error => console.error('Error fetching breeds:', error));
    };

    const handleBreedClick = (breedId) => {
        fetch(`https://dogapi.dog/api/v2/breeds/${breedId}`)
            .then(response => response.json())
            .then(data => setSelectedBreed(data.data))
            .catch(error => console.error('Error fetching breed details:', error));
    };
    return (
        <>
            <section id="home-section">
                <div className="container pb-16">
                    <div className="flex items-center justify-center mt-20">
                        <a href='/' className="inline">
                            <img src={LogoImg} className="w-40" alt="LogoImg"/>
                        </a>
                    </div>

                    {/* Group Name */}
                    {!selectedGroup && !selectedBreed && (
                        <div className="mt-14 group_name w-full lg:w-[1100px] mx-auto">
                            <h2 className="text-[20px] text-white font-semibold">
                                Select your group:
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 text-white">
                                {groups.map(group => (
                                    <div
                                        key={group.id}
                                        className="col cursor-pointer box bg-white pt-4 px-6 rounded"
                                        onClick={() => handleGroupClick(group)}
                                    >
                                        <h3 className="text-blue-600 font-bold text-[22px] w-[60%]">
                                            {group.attributes.name}
                                        </h3>
                                        <div className="flex items-end justify-end">
                                            <img src={DogImg} className="w-20" alt="DogImg"/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Selected Group */}
                    {selectedGroup && !selectedBreed && (
                        <div className="mt-14 selected_group w-full lg:w-[1100px] mx-auto">
                            <h2 className="text-[20px] text-white font-semibold">
                                Selected group: <span className="text-[#55FFDE]">{selectedGroup.attributes.name}</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 text-white">
                                {breeds.map(breed => (
                                    <div
                                        key={breed.id}
                                        className="col cursor-pointer box bg-white pt-4 px-6 rounded"
                                        onClick={() => handleBreedClick(breed.id)}
                                    >
                                        <h3 className="text-blue-600 font-bold text-[22px] w-[60%]">
                                            {breed.attributes.name}
                                        </h3>
                                        <div className="flex items-end justify-end">
                                            <img src={DogImg} className="w-20" alt="DogImg"/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Breeds Details */}
                    {selectedBreed && (
                        <div className="mt-14 group_name w-full lg:w-[1100px] mx-auto pb-6">
                            <div className="space-y-3">
                                <h2 className="text-[20px] text-white font-semibold">
                                    <span
                                        className="text-[#55FFDE] font-bold">Name:</span> {selectedBreed.attributes.name}
                                </h2>
                                <h2 className="text-[20px] text-white font-semibold mt-4">
                                    <span
                                        className="text-[#55FFDE] font-bold">Description:</span> {selectedBreed.attributes.description}
                                    <p className="mt-1">
                                        {selectedBreed.attributes.description}
                                    </p>
                                </h2>
                                <h2 className="text-[20px] text-white font-semibold">
                                    <span
                                        className="text-[#55FFDE] font-bold">Life:</span> max. {selectedBreed.attributes.life.max} years
                                    / min. {selectedBreed.attributes.life.min} years
                                </h2>
                                <h2 className="text-[20px] text-white font-semibold">
                                    <span
                                        className="text-[#55FFDE] font-bold">Hypoallergenic:</span> {selectedBreed.attributes.hypoallergenic ? 'yes' : 'no'}
                                </h2>
                                <h2 className="text-[20px] text-white font-semibold">
                                    <span
                                        className="text-[#55FFDE] font-bold">Male weight:</span> max. {selectedBreed.attributes.male_weight.max} /
                                    min. {selectedBreed.attributes.male_weight.min}
                                </h2>
                                <h2 className="text-[20px] text-white font-semibold">
                                    <span
                                        className="text-[#55FFDE] font-bold">Female weight:</span> max. {selectedBreed.attributes.female_weight.max} /
                                    min. {selectedBreed.attributes.female_weight.min}
                                </h2>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

export default App;