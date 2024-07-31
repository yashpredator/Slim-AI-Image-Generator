import React, { useState } from "react";
import FormField from "../components/FormField";
import { getRandomPrompt } from "../utils";
import { useNavigate } from "react-router-dom";
import preview from "../assets/preview.png";
import Loader from "../components/Loader";

const Create = () => {
  const navigate = useNavigate();
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch('http://localhost:8080/api/v1/unsplash', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: form.prompt,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error.message || 'Failed to generate image');
        }

        const data = await response.json();
        if (data.photo) {
          setForm({ ...form, photo: data.photo });
        } else {
          throw new Error('Failed to generate image');
        }
      } catch (err) {
        console.error('Error generating image:', err);
        alert('Error generating image: ' + err.message);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert('Please provide a proper prompt');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...form }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to share image');
        }
  
        await response.json();
        alert('Success');
        navigate('/');
      } catch (err) {
        console.error('Error sharing image:', err.message || err);
        alert('Error sharing image: ' + (err.message || err.toString()));
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please generate an image with proper details');
    }
  };
  
  return (
    <div className="ml-5">
      <div className="font-extrabold text-xl pt-5 pb-5">
        Create the image of your choice
      </div>
      <div className="text-gray-400 mb-5">
        This project generates an image based on whatever you write in the below text
      </div>
      <form className="" onSubmit={handleSubmit}>
        <div className="mb-5">
          <FormField
            labelName="Your name"
            type="text"
            name="name"
            placeholder="Enter your name..."
            value={form.name}
            handleChange={handleChange}
          />
        </div>
        <div>
          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="An Impressionist oil painting of sunflowers in a purple vase…"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
        </div>
        <div className="flex flex-row justify-center mt-5">
          <div className="relative bg-gray-100 border border-gray-200 w-96 flex flex-row justify-center items-center">
            {form.photo ? (
              <img className="w-full h-full object-contain" src={form.photo} alt={form.prompt} />
            ) : (
              <img className="object-contain h-9/12 w-9/12 opacity-40" src={preview} alt="preview" />
            )}
            {generatingImg && (
              <div className="absolute">
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center mt-5">
          <button className="bg-blue-700 text-white p-1 w-11/12 rounded-lg" type="button" onClick={generateImage}>
            {generatingImg ? 'Image is being generated...' : 'Generate'}
          </button>
        </div>
        <div className="flex flex-col items-center justify-center mt-5">
          <div>
            <p>After image generation you can share it with the community</p>
          </div>
          <div>
            <button className="bg-blue-700 text-white p-1 w-64 mt-4 rounded-lg mb-5" type="submit">
              {loading ? 'Sharing...' : 'Share with community'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Create;
