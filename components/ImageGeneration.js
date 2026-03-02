'use client'
import React, { useState } from 'react'
import Link from 'next/link'


export default function ImageGeneration() {
  const [count, setCount] = useState(4)
  const [leftMenu, setLeftMenu] = useState(false)
  const [isDropdown, setIsDropdown] = useState(false)
  const handleIsDropdown = () =>{
    setIsDropdown(!isDropdown)
  }

  const leftMenuHandler = () => {
    setLeftMenu(!leftMenu)
    document.querySelector('.techwave_fn_wrapper').classList.toggle("fn__has_sidebar")
  }

  const handleIncrement = () => {
    if (count < 20) {
      setCount(count + 1);
    }
  };
  const handleDecrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const handleInput = (event) => {
    const val = event.target.value;
    setSliderValue(val);
  };

  const [sliderValue, setSliderValue] = useState(7);

  return (
    <>
      <div className="techwave_fn_image_generation_page">
        <div className="generation__page">
          {/* Generation Header */}
          <div className="generation_header">
            <div className="header_top">
              <h1 className="title">Image Generation</h1>
              <div className="setup">
                <p className="info">This wil use <span className="count">4</span> tokens</p>
                <a className="sidebar__trigger" onClick={leftMenuHandler}>
                  <img src="svg/option.svg" alt="" className="fn__svg" />
                </a>
              </div>
            </div>
            <div className="header_bottom">
              <div className="include_area">
                <textarea id="fn__include_textarea" rows={1} />
                <textarea className="fn__hidden_textarea" rows={1} tabIndex={-1} />
              </div>
              <div className="exclude_area">
                <textarea id="fn__exclude_textarea" rows={1} />
                <textarea className="fn__hidden_textarea" rows={1} tabIndex={-1} />
              </div>
              <div className="generate_section">
                <label className="fn__toggle">
                  <span className="t_in">
                    <input type="checkbox" defaultChecked id="negative_prompt" />
                    <span className="t_slider" />
                    <span className="t_content" />
                  </span>
                  Negative Prompt
                </label>
                <Link id="generate_it" href="#" className="techwave_fn_button"><span>Generate</span></Link>
              </div>
            </div>
          </div>
          {/* !Generation Header */}
          <div className="generation_history">
            <div className="fn__generation_item">
              <div className="item_header">
                <div className="title_holder">
                  <h2 className="prompt_title">Frozen Glacial Mystical spiral Lighthouse, a minimalist lighthouse landscape with a mystical , Watercolor Clipart, comic, strybk, full Illustration, 4k, sharp focus, watercolor, smooth soft skin, symmetrical, soft lighting, detailed face, concept art, muted colors</h2>
                  <p className="negative_prompt_title">Negative prompt: Text, watermarks, off centre, blur, low res, out of frame, cut off, ugly</p>
                </div>
                <div className="item_options">
                  <div className="fn__icon_options medium_size align_right">
                    <Link href="#" className="fn__icon_button">
                      <img src="svg/info.svg" alt="" className="fn__svg" />
                    </Link>
                    <div className="fn__icon_popup">
                      <ul>
                        <li>
                          <span className="text">ArtShaper v3</span>
                        </li>
                        <li>
                          <span className="text">512 x 512px</span>
                        </li>
                        <li>
                          <span className="text">March 15,  2023</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="fn__icon_options medium_size align_right">
                    <Link href="#" className="fn__icon_button">
                      <span className="dots" />
                    </Link>
                    <div className="fn__icon_popup">
                      <ul>
                        <li>
                          <Link href="#">Copy Prompt</Link>
                        </li>
                        <li>
                          <Link href="#">Reuse Prompt</Link>
                        </li>
                        <li>
                          <Link href="#">Upscale All</Link>
                        </li>
                        <li>
                          <Link href="#">Download All</Link>
                        </li>
                        <li className="high_priorety">
                          <Link href="#">Delete All</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item_list">
                <ul className="fn__generation_list">
                  <li className="fn__gl_item">
                    <div className="fn__gl__item">
                      <div className="abs_item">
                        <img src="img/gallery/1.jpg" alt="" />
                        <div className="all_options">
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <img src="svg/download.svg" alt="" className="fn__svg" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Original Image</Link>
                                </li>
                                <li>
                                  <Link href="#">Creative Upscaled Image</Link>
                                </li>
                                <li>
                                  <Link href="#">HD Upscaled Image</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <img src="svg/upscale.svg" alt="" className="fn__svg" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Creative Upscale</Link>
                                </li>
                                <li>
                                  <Link href="#">Alternative Upscale</Link>
                                </li>
                                <li>
                                  <Link href="#">HD Upscale</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <span className="dots" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Make Variations</Link>
                                </li>
                                <li className="high_priorety">
                                  <Link href="#">Delete Image</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="fn__gl_item">
                    <div className="fn__gl__item">
                      <div className="abs_item">
                        <img src="img/gallery/2.jpg" alt="" />
                        <div className="all_options">
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <img src="svg/download.svg" alt="" className="fn__svg" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Original Image</Link>
                                </li>
                                <li>
                                  <Link href="#">Creative Upscaled Image</Link>
                                </li>
                                <li>
                                  <Link href="#">HD Upscaled Image</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <img src="svg/upscale.svg" alt="" className="fn__svg" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Creative Upscale</Link>
                                </li>
                                <li>
                                  <Link href="#">Alternative Upscale</Link>
                                </li>
                                <li>
                                  <Link href="#">HD Upscale</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <span className="dots" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Make Variations</Link>
                                </li>
                                <li className="high_priorety">
                                  <Link href="#">Delete Image</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="fn__gl_item">
                    <div className="fn__gl__item">
                      <div className="abs_item">
                        <img src="img/gallery/3.jpg" alt="" />
                        <div className="all_options">
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <img src="svg/download.svg" alt="" className="fn__svg" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Original Image</Link>
                                </li>
                                <li>
                                  <Link href="#">Creative Upscaled Image</Link>
                                </li>
                                <li>
                                  <Link href="#">HD Upscaled Image</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <img src="svg/upscale.svg" alt="" className="fn__svg" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Creative Upscale</Link>
                                </li>
                                <li>
                                  <Link href="#">Alternative Upscale</Link>
                                </li>
                                <li>
                                  <Link href="#">HD Upscale</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <span className="dots" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Make Variations</Link>
                                </li>
                                <li className="high_priorety">
                                  <Link href="#">Delete Image</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="fn__gl_item">
                    <div className="fn__gl__item">
                      <div className="abs_item">
                        <img src="img/gallery/4.jpg" alt="" />
                        <div className="all_options">
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <img src="svg/download.svg" alt="" className="fn__svg" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Original Image</Link>
                                </li>
                                <li>
                                  <Link href="#">Creative Upscaled Image</Link>
                                </li>
                                <li>
                                  <Link href="#">HD Upscaled Image</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <img src="svg/upscale.svg" alt="" className="fn__svg" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Creative Upscale</Link>
                                </li>
                                <li>
                                  <Link href="#">Alternative Upscale</Link>
                                </li>
                                <li>
                                  <Link href="#">HD Upscale</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <span className="dots" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Make Variations</Link>
                                </li>
                                <li className="high_priorety">
                                  <Link href="#">Delete Image</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="fn__generation_item">
              <div className="item_header">
                <div className="title_holder">
                  <h2 className="prompt_title">Frozen Glacial Mystical spiral Lighthouse, a minimalist lighthouse landscape with a mystical , Watercolor Clipart, comic, strybk, full Illustration, 4k, sharp focus, watercolor, smooth soft skin, symmetrical, soft lighting, detailed face, concept art, muted colors</h2>
                  <p className="negative_prompt_title">Negative prompt: Text, watermarks, off centre, blur, low res, out of frame, cut off, ugly</p>
                </div>
                <div className="item_options">
                  <div className="fn__icon_options medium_size align_right">
                    <Link href="#" className="fn__icon_button">
                      <img src="svg/info.svg" alt="" className="fn__svg" />
                    </Link>
                    <div className="fn__icon_popup">
                      <ul>
                        <li>
                          <span className="text">ArtShaper v3</span>
                        </li>
                        <li>
                          <span className="text">512 x 512px</span>
                        </li>
                        <li>
                          <span className="text">March 15,  2023</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="fn__icon_options medium_size align_right">
                    <Link href="#" className="fn__icon_button">
                      <span className="dots" />
                    </Link>
                    <div className="fn__icon_popup">
                      <ul>
                        <li>
                          <Link href="#">Copy Prompt</Link>
                        </li>
                        <li>
                          <Link href="#">Reuse Prompt</Link>
                        </li>
                        <li>
                          <Link href="#">Upscale All</Link>
                        </li>
                        <li>
                          <Link href="#">Download All</Link>
                        </li>
                        <li className="high_priorety">
                          <Link href="#">Delete All</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item_list">
                <ul className="fn__generation_list">
                  <li className="fn__gl_item">
                    <div className="fn__gl__item">
                      <div className="abs_item">
                        <img src="img/gallery/5.jpg" alt="" />
                        <div className="all_options">
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <img src="svg/download.svg" alt="" className="fn__svg" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Original Image</Link>
                                </li>
                                <li>
                                  <Link href="#">Creative Upscaled Image</Link>
                                </li>
                                <li>
                                  <Link href="#">HD Upscaled Image</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <img src="svg/upscale.svg" alt="" className="fn__svg" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Creative Upscale</Link>
                                </li>
                                <li>
                                  <Link href="#">Alternative Upscale</Link>
                                </li>
                                <li>
                                  <Link href="#">HD Upscale</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <span className="dots" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Make Variations</Link>
                                </li>
                                <li className="high_priorety">
                                  <Link href="#">Delete Image</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="fn__gl_item">
                    <div className="fn__gl__item">
                      <div className="abs_item">
                        <img src="img/gallery/6.jpg" alt="" />
                        <div className="all_options">
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <img src="svg/download.svg" alt="" className="fn__svg" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Original Image</Link>
                                </li>
                                <li>
                                  <Link href="#">Creative Upscaled Image</Link>
                                </li>
                                <li>
                                  <Link href="#">HD Upscaled Image</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <img src="svg/upscale.svg" alt="" className="fn__svg" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Creative Upscale</Link>
                                </li>
                                <li>
                                  <Link href="#">Alternative Upscale</Link>
                                </li>
                                <li>
                                  <Link href="#">HD Upscale</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <span className="dots" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Make Variations</Link>
                                </li>
                                <li className="high_priorety">
                                  <Link href="#">Delete Image</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="fn__gl_item">
                    <div className="fn__gl__item">
                      <div className="abs_item">
                        <img src="img/gallery/7.jpg" alt="" />
                        <div className="all_options">
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <img src="svg/download.svg" alt="" className="fn__svg" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Original Image</Link>
                                </li>
                                <li>
                                  <Link href="#">Creative Upscaled Image</Link>
                                </li>
                                <li>
                                  <Link href="#">HD Upscaled Image</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <img src="svg/upscale.svg" alt="" className="fn__svg" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Creative Upscale</Link>
                                </li>
                                <li>
                                  <Link href="#">Alternative Upscale</Link>
                                </li>
                                <li>
                                  <Link href="#">HD Upscale</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <span className="dots" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Make Variations</Link>
                                </li>
                                <li className="high_priorety">
                                  <Link href="#">Delete Image</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="fn__gl_item">
                    <div className="fn__gl__item">
                      <div className="abs_item">
                        <img src="img/gallery/8.jpg" alt="" />
                        <div className="all_options">
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <img src="svg/download.svg" alt="" className="fn__svg" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Original Image</Link>
                                </li>
                                <li>
                                  <Link href="#">Creative Upscaled Image</Link>
                                </li>
                                <li>
                                  <Link href="#">HD Upscaled Image</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <img src="svg/upscale.svg" alt="" className="fn__svg" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Creative Upscale</Link>
                                </li>
                                <li>
                                  <Link href="#">Alternative Upscale</Link>
                                </li>
                                <li>
                                  <Link href="#">HD Upscale</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <span className="dots" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Make Variations</Link>
                                </li>
                                <li className="high_priorety">
                                  <Link href="#">Delete Image</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="fn__generation_item">
              <div className="item_header">
                <div className="title_holder">
                  <h2 className="prompt_title">Frozen Glacial Mystical spiral Lighthouse, a minimalist lighthouse landscape with a mystical , Watercolor Clipart, comic, strybk, full Illustration, 4k, sharp focus, watercolor, smooth soft skin, symmetrical, soft lighting, detailed face, concept art, muted colors</h2>
                  <p className="negative_prompt_title">Negative prompt: Text, watermarks, off centre, blur, low res, out of frame, cut off, ugly</p>
                </div>
                <div className="item_options">
                  <div className="fn__icon_options medium_size align_right">
                    <Link href="#" className="fn__icon_button">
                      <img src="svg/info.svg" alt="" className="fn__svg" />
                    </Link>
                    <div className="fn__icon_popup">
                      <ul>
                        <li>
                          <span className="text">ArtShaper v3</span>
                        </li>
                        <li>
                          <span className="text">512 x 512px</span>
                        </li>
                        <li>
                          <span className="text">March 15,  2023</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="fn__icon_options medium_size align_right">
                    <Link href="#" className="fn__icon_button">
                      <span className="dots" />
                    </Link>
                    <div className="fn__icon_popup">
                      <ul>
                        <li>
                          <Link href="#">Copy Prompt</Link>
                        </li>
                        <li>
                          <Link href="#">Reuse Prompt</Link>
                        </li>
                        <li>
                          <Link href="#">Upscale All</Link>
                        </li>
                        <li>
                          <Link href="#">Download All</Link>
                        </li>
                        <li className="high_priorety">
                          <Link href="#">Delete All</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item_list">
                <ul className="fn__generation_list">
                  <li className="fn__gl_item">
                    <div className="fn__gl__item">
                      <div className="abs_item">
                        <img src="img/gallery/1.jpg" alt="" />
                        <div className="all_options">
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <img src="svg/download.svg" alt="" className="fn__svg" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Original Image</Link>
                                </li>
                                <li>
                                  <Link href="#">Creative Upscaled Image</Link>
                                </li>
                                <li>
                                  <Link href="#">HD Upscaled Image</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <img src="svg/upscale.svg" alt="" className="fn__svg" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Creative Upscale</Link>
                                </li>
                                <li>
                                  <Link href="#">Alternative Upscale</Link>
                                </li>
                                <li>
                                  <Link href="#">HD Upscale</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <span className="dots" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Make Variations</Link>
                                </li>
                                <li className="high_priorety">
                                  <Link href="#">Delete Image</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="fn__gl_item">
                    <div className="fn__gl__item">
                      <div className="abs_item">
                        <img src="img/gallery/2.jpg" alt="" />
                        <div className="all_options">
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <img src="svg/download.svg" alt="" className="fn__svg" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Original Image</Link>
                                </li>
                                <li>
                                  <Link href="#">Creative Upscaled Image</Link>
                                </li>
                                <li>
                                  <Link href="#">HD Upscaled Image</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <img src="svg/upscale.svg" alt="" className="fn__svg" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Creative Upscale</Link>
                                </li>
                                <li>
                                  <Link href="#"> Alternative Upscale</Link>
                                </li>
                                <li>
                                  <Link href="#">HD Upscale</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <span className="dots" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Make Variations</Link>
                                </li>
                                <li className="high_priorety">
                                  <Link href="#">Delete Image</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="fn__gl_item">
                    <div className="fn__gl__item">
                      <div className="abs_item">
                        <img src="img/gallery/3.jpg" alt="" />
                        <div className="all_options">
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <img src="svg/download.svg" alt="" className="fn__svg" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Original Image</Link>
                                </li>
                                <li>
                                  <Link href="#">Creative Upscaled Image</Link>
                                </li>
                                <li>
                                  <Link href="#">HD Upscaled Image</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <img src="svg/upscale.svg" alt="" className="fn__svg" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Creative Upscale</Link>
                                </li>
                                <li>
                                  <Link href="#"> Alternative Upscale</Link>
                                </li>
                                <li>
                                  <Link href="#">HD Upscale</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <span className="dots" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Make Variations</Link>
                                </li>
                                <li className="high_priorety">
                                  <Link href="#">Delete Image</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="fn__gl_item">
                    <div className="fn__gl__item">
                      <div className="abs_item">
                        <img src="img/gallery/4.jpg" alt="" />
                        <div className="all_options">
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <img src="svg/download.svg" alt="" className="fn__svg" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Original Image</Link>
                                </li>
                                <li>
                                  <Link href="#">Creative Upscaled Image</Link>
                                </li>
                                <li>
                                  <Link href="#">HD Upscaled Image</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <img src="svg/upscale.svg" alt="" className="fn__svg" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Creative Upscale</Link>
                                </li>
                                <li>
                                  <Link href="#"> Alternative Upscale</Link>
                                </li>
                                <li>
                                  <Link href="#">HD Upscale</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="fn__icon_options medium_size">
                            <Link href="#" className="fn__icon_button">
                              <span className="dots" />
                            </Link>
                            <div className="fn__icon_popup">
                              <ul>
                                <li>
                                  <Link href="#">Make Variations</Link>
                                </li>
                                <li className="high_priorety">
                                  <Link href="#">Delete Image</Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="generation_more">
              <Link href="pricing" className="techwave_fn_button medium"><span>Previous Generations</span></Link>
            </div>
          </div>
        </div>
        <div className="generation__sidebar">
          <div className="sidebar_model">
            <div className={`fn__select_model ${isDropdown ? 'opened' : ''}`}>
              <Link href="#" className="model_open">
                <img className="user_img" src="img/user/user.jpg" alt="" />
                <div className="author">
                  <h4 className="subtitle">Model</h4>
                  <h3 className="title">ArtShaper v3</h3>
                </div>
                <span className="fn__icon_button" onClick={handleIsDropdown}>
                  <img src="svg/arrow.svg" alt="" className="fn__svg" />
                </span>
              </Link>
              <div className="all_models">
                <ul>
                  <li><Link className="selected" href="#">ArtShaper v3</Link></li>
                  <li><Link href="#">ArtShaper v2</Link></li>
                  <li><Link href="#">GameVisuals</Link></li>
                  <li><Link href="#">VintageCar</Link></li>
                  <li><Link href="#">ArtDeco</Link></li>
                  <li><Link href="#">IceCold</Link></li>
                  <li><Link href="#">Water Effect</Link></li>
                  <li><Link href="#">Stable Diffusion v2</Link></li>
                  <li><Link href="#">Stable Diffusion v1</Link></li>
                  <li><Link href="#">Other</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="sidebar_details">
            <div className="number_of_images">
              <h4 className="title">Number of Images</h4>
              <div className="fn__quantity">
                <a className="decrease" onClick={handleDecrement} />
                <input type="number" defaultValue={count} max={20} min={1} />
                {/* <span>{count}</span> */}
                <a className="increase" onClick={handleIncrement} />
              </div>
            </div>
            <div className="img_sizes">
              <h4 className="title">Image Dimensions</h4>
              <div className="img_size_select">
                <select>
                  <option defaultValue="512_512">512 x 512px</option>
                  <option value="768_768">768 x 768px</option>
                  <option value="512_1024">512 x 1024px</option>
                  <option value="768_1024">768 x 1024px</option>
                  <option value="1024_1024">1024 x 1024px</option>
                </select>
              </div>
            </div>
            <div className="guidance_scale">
              <h4 className="title">Image Dimensions<span className="fn__tooltip" title="Select the resoultion of the images."><img src="svg/question.svg" alt="" className="fn__svg" /></span></h4>
              <div className="fn__range">
                <div className="range_in">
                  <input
                    type="range"
                    min={1}
                    max={40}
                    value={sliderValue}
                    onChange={handleInput}
                  />
                  <div className="slider" style={{ width: (sliderValue * 2.5) + '%' }}></div>
                </div>
                <div className="value">{sliderValue}</div>
              </div>
            </div>
            <div className="prompt_magic_switcher">
              <h4 className="title"><label htmlFor="prompt_switcher">Prompt Magic</label><span className="fn__tooltip" title="TechWave Prompt v3.0. Our custom render pipeline which has much faster compliance and can improve the result with any model selected. Applies a 2x multiplier to accepted costs due to higher GPU overhead."><img src="svg/question.svg" alt="" className="fn__svg" /></span></h4>
              <label className="fn__toggle">
                <span className="t_in">
                  <input type="checkbox" defaultChecked id="prompt_switcher" />
                  <span className="t_slider" />
                  <span className="t_content" />
                </span>
              </label>
            </div>
            <div className="contrast_switcher">
              <h4 className="title"><label htmlFor="contrast_switcher">High Contrast</label><span className="fn__tooltip" title="If your photo consists of extremely bright and dark areas, then it's considered high contrast. When it has a wide range of tones that go from pure white to pure black, it's medium contrast. No pure whites or blacks and a range of middle tones means it's low contrast."><img src="svg/question.svg" alt="" className="fn__svg" /></span></h4>
              <label className="fn__toggle">
                <span className="t_in">
                  <input type="checkbox" id="contrast_switcher" />
                  <span className="t_slider" />
                  <span className="t_content" />
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
