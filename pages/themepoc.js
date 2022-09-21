import React from 'react'
import './js/jquery-1.11.2.min'
import './js/DateTimePicker'
import './js/functions.js'
import './js/jquery-1.11.2.min.js'
import Image from 'next/image';
import Logo from '../components/img/logo.png';
import Mosaic1 from '../components/img/mosaic_1.jpg'
import Mosaic2 from '../components/img/mosaic_2.jpg'
import Mosaic3 from '../components/img/mosaic_3.jpg'
import Mosaic4 from '../components/img/mosaic_4.jpg'
import HeaderHome from '../components/img/sub_header_home.jpg'
import RoomHome from '../components/img/room_home_3.jpg'
import Testmonial from '../components/img/testimonial_1.jpg'
import LogoFooter from '../components/img/logo_footer.png'

function Themepoc() {
    
  return (
    <div className='text-lg'>
      <header>
    <div className="container">
        <div className="row">
            <div className="col--md-3 col-sm-3 col-xs-3  mt-6">
                <a href="index.html" id="logo">
                <Image
                src={Logo}
                    alt="Picture of the author"
                        width={140}  height={35} className="logo_sticky" />
                 </a>
            </div>
            <nav className="col--md-9 col-sm-9 col-xs-9 ">
            <a className="cmn-toggle-switch cmn-toggle-switch__htx open_close" href="javascript:void(0);"><span>Menu mobile</span></a>
            <ul id="lang_top">
                <li><a href="#" className="active">EN</a></li>
                <li><a href="#">FR</a></li>
                <li><a href="#">ES</a></li>
            </ul>
            <div className="main-menu">
                <div id="header_menu">

                     <img src="img/logo_m.png" width="141" height="40" alt="" data-retina="true"/>
                </div>
                <a href="#" className="open_close" id="close_in"><i className="icon_set_1_icon-77"></i></a>
                 <ul>
                    <li className="submenu">
                    <a href="javascript:void(0);" className="show-submenu">Home<i className="icon-down-open-mini"></i></a>
                    <ul>
                        <li><a href="index.html">Home Booking</a></li>
                        <li><a href="index_5.html">Home Booking date 2</a></li>
                        <li><a href="index_4.html">Home Carousel</a></li>
                        <li><a href="index_2.html">Home Layer Slider</a></li>
                        <li><a href="index_6.html">Home Video bg</a></li>
                        <li><a href="index_3.html">Home Text Rotator</a></li>
                    </ul>
                    </li>
                    <li><a href="room_list.html">Rooms</a></li>
                    <li className="submenu">
                    <a href="javascript:void(0);" className="show-submenu">Pages<i className="icon-down-open-mini"></i></a>
                    <ul>
                    	<li><a href="room_detail.html">Room detail</a></li>
                        <li><a href="room_detail_2.html">Room detail date 2</a></li>
                        <li><a href="about.html">About us</a></li>
                        <li><a href="faq.html">Faq</a></li>
                        <li><a href="gallery.html">Gallery</a></li>
                        <li><a href="blog.html">Blog</a></li>
                        <li><a href="coming_soon/index.html">Site launch/Coming soon</a></li>
                        <li><a href="shortcodes.html">Shortcodes</a></li>
                        <li><a href="icon_pack_1.html">Icon pack 1</a></li>
                         <li><a href="icon_pack_2.html">Icon pack 2</a></li>
                        <li><a href="icon_pack_3.html">Icon pack 3</a></li>
                    </ul>
                    </li>
                    <li><a href="contacts.html">Contacts</a></li>
                     <li><a href="#0">Purchase this template</a></li>
                </ul>
            </div>
            </nav>
        </div>
    </div>
    </header>
    
	
    <div className="parallax-window" id="booking" 
    data-parallax="scroll"  data-natwidth="1400" data-natural-height="550">
             <div className='relative z-0'>
              <Image
                src={HeaderHome} 
                    alt="Picture of the author"
                        width={1400}  height={550} className="logo_sticky" /></div>
       
        <div id="subheader_home" className='absolute inset-0 flex  z-10'>
            <div id="sub_content">
                <div id="book_container">
                    <form method="post" action="assets/check_avail_home.php" id="check_avail_home" autoComplete="off">
                        <div id="group_1">
                            <div id="container_1">
                                <label>Arrival date</label>
                            	<input className="startDate1 form-control datepick" type="text" data-field="date" data-startend="start" data-startendelem=".endDate1" readOnly placeholder="Arrival" id="check_in" name="check_in"/>
                                <span className="input-icon"><i className="icon-calendar-7"></i></span>
                            </div>
                            <div id="container_2">
                                <label>Departure date</label>
                                 <input className="endDate1 form-control datepick" type="text" data-field="date" data-startend="end" data-startendelem=".startDate1" readOnly placeholder="Departure" id="check_out" name="check_out"/>
                                <span className="input-icon"><i className="icon-calendar-7"></i></span>
                            </div>
                        </div>
                        <div id="group_2">
                            <div id="container_3">
                                <label>Adults</label>
                                <div className="qty-buttons">
                                    <input type="button" value="-" className="qtyminus" name="adults"/>
                                    <input type="text" name="adults" id="adults" value="" className="qty form-control" placeHolder="0"/>
                                    <input type="button" value="+" className="qtyplus" name="adults"/>
                                </div>
                            </div>
                            <div id="container_4">
                                <label>Children</label>
                                <div className="qty-buttons">
                                    <input type="button" value="-" className="qtyminus" name="children"/>
                                    <input type="text" name="children" id="children" value="" className="qty form-control" placeHolder="0"/>
                                    <input type="button" value="+" className="qtyplus" name="children"/>
                                </div>
                            </div>
                        </div>
                        <div id="group_3">
                            <div id="container_5">
                                <label>Name</label>
                                <input type="text" className="form-control" name="name_booking" id="name_booking" placeHolder="Name and Last name"/>
                            </div>
                            <div id="container_6">
                                <label>Email</label>
                                <input type="text" className="form-control" name="email_booking" id="email_booking" placeHolder="Your email"/>
                            </div>
                        </div>
                        <div id="container_7">
                            <input type="submit" value="Check availability" className="btn_1" id="submit-booking"/>
                        </div>
                    </form>
                    <div id="message-booking"></div>
                </div>
            </div>
        </div>
    </div>
            
    <div className="container margin_60_35">
        <h1 className="main_title"><em></em>Welcome to Albert <span>Hotel and Bed&amp;Breakfast</span></h1>
        <p className="lead styled">
            Usu habeo equidem sanctus no. Suas summo id sed, erat erant oporteat cu pri. In eum omnes molestie. Sed ad debet scaevola, ne mel lorem legendos. Unum etiam cum te, an elit assueverit vix, falli aliquam complectitur ex ius.
        </p>
        <div className="row">
            <div className="col-sm-6">
                <div className="mosaic_container mt-8">
                <Image
                src={Mosaic1}
                    alt="Picture of the author"
                        width={800} height={533} className="img-responsive add_bottom_30" />
                    <span className="caption_2">Nice Outdoor</span>
                </div>
            </div>
            <div className="col-sm-6 mt-8">
                <div className="col-xs-12 ">
                    <div className="mosaic_container">
                    <Image
                src={Mosaic2}
                    alt="Picture of the author"
                        width={800} height={267} className="img-responsive add_bottom_30" />
                      <span className="caption_2">Large Bedroom</span>
                    </div>
                </div>
                <div className="col-xs-6 my-8">
                    <div className="mosaic_container">
                    <Image
                src={Mosaic3}
                    alt="Picture of the author"
                        width={400} height={267} className="img-responsive add_bottom_30" />
                        <span className="caption_2">Modern Bathroom</span>
                    </div>
                </div>
                <div className="col-xs-6 my-8">
                    <div className="mosaic_container">
                    <Image
                src={Mosaic4}
                    alt="Picture of the author"
                        width={400} height={267} className="img-responsive add_bottom_30" />
                        <span className="caption_2">Wellness</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div className="container_styled_1">
        <div className="container margin_60">
            <div className="row">
                <div className="col-md-5 col-md-offset-1">
                    <figure className="room_pic"><a href="#">
                        <img src="img/room_home_1.jpg" alt="" className="img-responsive"/></a><span className="wow zoomIn"><sup>$</sup>120<small>Per night</small></span></figure>
                </div>
                <div className="col-md-4 col-md-offset-1">
                    <div className="room_desc_home">
                        <h3>Single Room </h3>
                        <p>
                             Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.
                        </p>
                        <ul>
                            <li>
                            <div className="tooltip_styled tooltip-effect-4">
                                <span className="tooltip-item"><i className="icon_set_2_icon-104"></i></span>
                                <div className="tooltip-content">
                                    King size bed
                                </div>
                            </div>
                            </li>
                            <li>
                            <div className="tooltip_styled tooltip-effect-4">
                                <span className="tooltip-item"><i className="icon_set_2_icon-118"></i></span>
                                <div className="tooltip-content">
                                    Shower
                                </div>
                            </div>
                            </li>
                            <li>
                            <div className="tooltip_styled tooltip-effect-4">
                                <span className="tooltip-item"><i className="icon_set_2_icon-116"></i></span>
                                <div className="tooltip-content">
                                    Plasma TV
                                </div>
                            </div>
                            </li>
                        </ul>
                        <a href="#0" className="btn_1_outline">Read more</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div className="container margin_60">
        <div className="row">
            <div className="col-md-5 col-md-offset-1 col-md-push-5">
                  <figure className="room_pic left">
                    
                  <Image
                    src={RoomHome} 
                    alt="Picture of the author"
                        width={800}  height={480} />
                   <span className="wow zoomIn"><sup>$</sup>150<small>Per night</small></span></figure>
            </div>
            <div className="col-md-4 col-md-offset-1 col-md-pull-6">
                <div className="room_desc_home">
                    <h3>Double Room </h3>
                    <p>
                         Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.
                    </p>
                    <ul>
                        <li>
                        <div className="tooltip_styled tooltip-effect-4">
                            <span className="tooltip-item"><i className="icon_set_2_icon-104"></i></span>
                            <div className="tooltip-content">
                                King size bed
                            </div>
                        </div>
                        </li>
                        <li>
                        <div className="tooltip_styled tooltip-effect-4">
                            <span className="tooltip-item"><i className="icon_set_2_icon-111"></i></span>
                            <div className="tooltip-content">
                                Bathtub
                            </div>
                        </div>
                        </li>
                        <li>
                        <div className="tooltip_styled tooltip-effect-4">
                            <span className="tooltip-item"><i className="icon_set_2_icon-116"></i></span>
                            <div className="tooltip-content">
                                Plasma TV
                            </div>
                        </div>
                        </li>
                        <li>
                        <div className="tooltip_styled tooltip-effect-4">
                            <span className="tooltip-item"><i className="icon_set_2_icon-106"></i></span>
                            <div className="tooltip-content">
                                Safe box
                            </div>
                        </div>
                        </li>
                    </ul>
                    <a href="#0" className="btn_1_outline">Read more</a>
                </div>
            </div>
        </div>
    </div>
    
    <div className="container_styled_1">
        <div className="container margin_60">
            <div className="row">
                <div className="col-md-5 col-md-offset-1 ">
                    <figure className="room_pic absolute z-10"><a href="#">
                    <Image
                    src={RoomHome} 
                    alt="Picture of the author"
                        width={800}  height={480} className="img-responsive" /></a><span className="wow zoomIn"><sup>$</sup>190<small>Per night</small></span></figure>
                </div>
                <div className="col-md-4 col-md-offset-1">
                    <div className="room_desc_home">
                        <h3>Suite Room </h3>
                        <p>
                             Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.
                        </p>
                        <ul>
                            <li>
                            <div className="tooltip_styled tooltip-effect-4">
                                <span className="tooltip-item"><i className="icon_set_2_icon-104"></i></span>
                                <div className="tooltip-content">
                                    King size bed
                                </div>
                            </div>
                            </li>
                            <li>
                            <div className="tooltip_styled tooltip-effect-4">
                                <span className="tooltip-item"><i className="icon_set_2_icon-111"></i></span>
                                <div className="tooltip-content">
                                    Bathtub
                                </div>
                            </div>
                            </li>
                            <li>
                            <div className="tooltip_styled tooltip-effect-4">
                                <span className="tooltip-item"><i className="icon_set_2_icon-116"></i></span>
                                <div className="tooltip-content">
                                    Plasma TV
                                </div>
                            </div>
                            </li>
                            <li>
                            <div className="tooltip_styled tooltip-effect-4">
                                <span className="tooltip-item"><i className="icon_set_1_icon-15"></i></span>
                                <div className="tooltip-content">
                                    Welcome bottle
                                </div>
                            </div>
                            </li>
                            <li>
                            <div className="tooltip_styled tooltip-effect-4">
                                <span className="tooltip-item"><i className="icon_set_2_icon-106"></i></span>
                                <div className="tooltip-content">
                                    Safe box
                                </div>
                            </div>
                            </li>
                        </ul>
                        <a href="#0" className="btn_1_outline">Read more</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <section className="promo_full">
    <div className="promo_full_wp">
        <div>
            <h3>What Clients say<span>Id tale utinam ius, an mei omnium recusabo iracundia.</span></h3>
            <div className="container">
                <div className="row">
                    <div className="col-md-8 col-md-offset-2">
                        <div className="carousel_testimonials">
                        
                            <div>
                                <div className="box_overlay">
                                    <div className="pic">
                                        <figure>
                                        <Image
                    src={Testmonial} 
                    alt="Picture of the author"
                        className="img-circle" />
                                            </figure>
                                        <h4>Roberta<small>12 October 2015</small></h4>
                                    </div>
                                    <div className="comment">
                                        Mea ad postea meliore fuisset. Timeam repudiare id eum, ex paulo dictas elaboraret sed, mel cu unum nostrud. No nam indoctum accommodare, vix ei discere civibus philosophia. Vis ea dicant diceret ocurreret.
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <div className="box_overlay">
                                    <div className="pic">
                                        <figure>
                                        <Image
                    src={Testmonial} 
                    alt="Picture of the author"
                        width={800}  height={480}  className="img-circle" /> 
                                           </figure>
                                        <h4>Roberta<small>12 October 2015</small></h4>
                                    </div>
                                    <div className="comment">
                                        Mea ad postea meliore fuisset. Timeam repudiare id eum, ex paulo dictas elaboraret sed, mel cu unum nostrud. No nam indoctum accommodare, vix ei discere civibus philosophia. Vis ea dicant diceret ocurreret.
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <div className="box_overlay">
                                    <div className="pic">
                                        <figure>
                                        <Image
                    src={Testmonial} 
                    alt="Picture of the author"
                        width={800}  height={480}  className="img-circle" /></figure>
                                        <h4>Roberta<small>12 October 2015</small></h4>
                                    </div>
                                    <div className="comment">
                                        Mea ad postea meliore fuisset. Timeam repudiare id eum, ex paulo dictas elaboraret sed, mel cu unum nostrud. No nam indoctum accommodare, vix ei discere civibus philosophia. Vis ea dicant diceret ocurreret.
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </section>   
    
    <div id="dtBox"></div>
    
     <footer >
        <div className="container">
            <div className="row">
                <div className="col-md-4 col-sm-12">
                <Image
                    src={LogoFooter} 
                    alt="Picture of the author"
                        width={141}  height={40}  id="logo_footer" data-retina="true" />
                    
                    <ul id="contact_details_footer">
          				<li>Route de Sablet 1023, Marseille<br/>France 01923</li>
                        <li><a href="tel://004542344599">+45 423 445 99</a> / <a href="#0">info@albert.com</a></li>
                    </ul>  
                </div>
                <div className="col-md-2 col-sm-4">
                    <h3>About</h3>
                    <ul>
                        <li><a href="#">About us</a></li>
                        <li><a href="#">Rooms</a></li>
                        <li><a href="#">Activities</a></li>
                        <li><a href="#">Contact us</a></li>
                         <li><a href="#">Gallery</a></li>
                    </ul>
                </div>                
                <div className="col-md-3 col-sm-4">
                    <h3>Change language</h3>
                   <ul>
                        <li><a href="#">English</a></li>
                        <li><a href="#">French</a></li>
                        <li><a href="#">Spanish</a></li>
                    </ul>
                </div>
                <div className="col-md-3 col-sm-4"  id="newsletter">
                    <h3>Newsletter</h3>
                    <p>Join our newsletter to keep be informed about offers and news.</p>
					<div id="message-newsletter_2"></div>
						<form method="post" action="assets/newsletter.php" name="newsletter_2" id="newsletter_2">
                        <div className="form-group">
                            <input name="email_newsletter_2" id="email_newsletter_2"  type="email" value=""  placeHolder="Your mail" className="form-control"/>
                          </div>
                            <input type="submit" value="Subscribe" className="btn_1 white" id="submit-newsletter_2"/>
                    	</form>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div id="social_footer">
                        <ul>
                            <li><a href="#"><i className="icon-facebook"></i></a></li>
                            <li><a href="#"><i className="icon-twitter"></i></a></li>
                            <li><a href="#"><i className="icon-google"></i></a></li>
                            <li><a href="#"><i className="icon-instagram"></i></a></li>
                            <li><a href="#"><i className="icon-pinterest"></i></a></li>
                            <li><a href="#"><i className="icon-vimeo"></i></a></li>
                            <li><a href="#"><i className="icon-youtube-play"></i></a></li>
                        </ul>
                        <p>© Albert 2019</p>
                    </div>
                </div>
            </div>
        </div>
    </footer>

    
    </div>
  )
}

export default Themepoc
Themepoc.getLayout = function PageLayout(page) {
    return (
      <>
        {page}
      </>
    )
  }