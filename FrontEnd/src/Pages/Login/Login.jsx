import React, { useEffect, useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import {  FiPhone } from 'react-icons/fi'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { app, db } from "../../config/firebaseConfig"
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Box, Input, Image, Flex, Button, HStack, PinInput, PinInputField, Grid } from "@chakra-ui/react";
import {
    getAuth,
    signInWithPhoneNumber,
    RecaptchaVerifier,
    updateProfile,
    signInWithPopup,
    GoogleAuthProvider
  } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom'
// import { googleloginsuccess, loginsuccess, phoneloginsuccess } from '../../Redux/AuthReducer/action'
// import { useDispatch } from 'react-redux'


const PhoneLogin = () => {

    const auth = getAuth();
    const user = auth.currentUser;
    // const dispatch =useDispatch()
    const navigate = useNavigate();
    const Googleprovider = new GoogleAuthProvider();
  
    const [err, seterr] = useState("");
    const [data, setdata] = useState({});
    const [value, setValue] = useState("");
    const [otpsec, setotpsec] = useState(false);
    const [OTP, setOTP] = useState("");
    const [name,setname]= useState("")
  
    const handleInput = (event) => {
      let input = { [event.target.name]: event.target.value };
      setdata({ ...data, ...input });
    };
  
    const genrateRecaptcha = () => {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "sign-in-button",
        {
          size: "invisible",
          callback: (response) => {}
        },
        auth
      );
    };

    const handleGooglelogin = () => {

      signInWithPopup(auth, Googleprovider)
        .then((userCredential) => {
          const {displayName, uid} = userCredential.user;
          console.log(displayName, uid);
          setname(displayName)
          const query = doc(db,"users", `${uid}`)
          getDoc(query)
          .then((res)=> {
            console.log(res)

            
            if(!res._document){
                updateProfile(auth.currentUser, {
                    displayName: data.username
                  });
                  const docData={
                    address: {
                      pincode: "",
                      locality: "",
                      city: "",
                      state: "",
                    },
                    wishlist:[],
                    bag:[],
                    phone:value
                  }
                 setDoc(doc(db, "users", `${userCredential.user.uid}`), docData);
            }
  
            // const address= {
            //   pincode: res._document.data.value.mapValue.fields.address.mapValue.fields.pincode.integerValue,
            //   locality: res._document.data.value.mapValue.fields.address.mapValue.fields.locality,
            //   city: res._document.data.value.mapValue.fields.address.mapValue.fields.city.stringValue,
            //   state: res._document.data.value.mapValue.fields.address.mapValue.fields.state.stringValue,
            // }
            // const { bag, phone, wishlist}={
            //     bag:res._document.data.value.mapValue.fields.bag.arrayValue.values,
            //     phone:res._document.data.value.mapValue.fields.phone.stringValue,
            //     wishlist:res._document.data.value.mapValue.fields.wishlist.arrayValue.values,
            // }
  
            // dispatch(googleloginsuccess({displayName, uid, address, bag, phone, wishlist }))
            alert("loginsssss")
            // navigate("/");
  
          }).catch((err)=>{
            const docData={
              address: {
                pincode: "",
                locality: "",
                city: "",
                state: "",
              },
              wishlist:[],
              bag:[],
              phone:""
            }
           setDoc(doc(db, "users", `${userCredential.user.uid}`), docData);
           navigate("/");
          })
          
        })
        .catch((err) => {
          alert(err.message);
        });
    };
    

    const handleSubmit = () => {
      if (value === "" || value === undefined || value.length < 12)
        return seterr("invalid phone No.");
      genrateRecaptcha();
      const AppVerifier = window.recaptchaVerifier;
      signInWithPhoneNumber(auth, `+${value}`, AppVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          setotpsec(true);
        })
        .catch((error) => {
          alert("Error SMS not sent please try again" + `${error}`);
        });
    };


    const checkotp=()=>{
   
      if (OTP.length === 6) {
        console.log(OTP);
        let confirmationResult = window.confirmationResult;
        confirmationResult
          .confirm(OTP)
          .then((userCredential) => {
            const {displayName, uid} = userCredential.user;
            console.log(displayName, uid);
            setname(displayName)
            const query = doc(db,"users", `${uid}`)
            getDoc(query)
            .then((res)=> {
                console.log(res)

                if(!res._document){
                    updateProfile(auth.currentUser, {
                        displayName: data.username
                      });
                      const docData={
                        address: {
                          pincode: "",
                          locality: "",
                          city: "",
                          state: "",
                        },
                        wishlist:[],
                        bag:[],
                        phone:value
                      }
                     setDoc(doc(db, "users", `${userCredential.user.uid}`), docData);
                }
            //   const address= {
            //     pincode: res._document.data.value.mapValue.fields.address.mapValue.fields.pincode.integerValue,
            //     locality: res._document.data.value.mapValue.fields.address.mapValue.fields.locality,
            //     city: res._document.data.value.mapValue.fields.address.mapValue.fields.city.stringValue,
            //     state: res._document.data.value.mapValue.fields.address.mapValue.fields.state.stringValue,
            //   }
            //   const { bag, phone, wishlist}={
            //       bag:res._document.data.value.mapValue.fields.bag.arrayValue.values,
            //       phone:res._document.data.value.mapValue.fields.phone.stringValue,
            //       wishlist:res._document.data.value.mapValue.fields.wishlist.arrayValue.values,
            //   }
    
            //   dispatch(phoneloginsuccess({displayName, uid, address, bag, phone, wishlist }))
            //   navigate("/");
            alert("login succeddfull")
    
            }).catch((err)=>{
              updateProfile(auth.currentUser, {
                displayName: data.username
              });
              const docData={
                address: {
                  pincode: "",
                  locality: "",
                  city: "",
                  state: "",
                },
                wishlist:[],
                bag:[],
                phone:value
              }
             setDoc(doc(db, "users", `${userCredential.user.uid}`), docData);
             navigate("/");
            })})
          .catch((error) => {
            alert(error);
          });
      }
    }
 

  return (
    // <ChakraProvider>
    <div style={{marginTop:"150px"}}>
    {/* <Flex h="100vh" alignItems="center" justifyContent="center" >
      <Box
        w="300px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDir="column"
        gap="4"
        borderWidth="1px"
        color="white"
      > */}
        <Grid templateColumns={"repeat(2,1fr)"} ml="20%" mr="20%" w="900px" h="300px"  justifyContent={"center"}>
        <Box w="100%" h="90%" textAlign="center" ml="5%"  >
        <Image 
          src={otpsec? "https://constant.myntassets.com/pwa/assets/img/al_banner.png":"https://geekflare.com/wp-content/uploads/2022/07/Adobe.png"}
          alt="Dan Abramov"
          
          w="100%"
          h="95%"
          // w={otpsec? "90%":"100%"}
        />
        </Box>
        
        <Box>
        <Flex  alignItems="center" justifyContent="center" >
          <Box  w="400px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDir="column"
        gap="4"
        borderWidth="1px"
        color="white">
        <Input w="90%" p="20px" placeholder="Username" name="username" onChange={handleInput}  color="black" size="sm" />
        <PhoneInput
        inputProps={{
          name: "phone",
          required: true,
          autoFocus: true
        }}
        masks={{ uy: ".. ... ...", py: "... ......" }}
        autoFocus={true}
        country="in"
        countryCodeEditable={false}
        placeholder="phone"
        onChange={setValue}
        containerStyle={{
            width: "100%",
        }}
        buttonStyle={{ 
            width: "15%",
            marginLeft: "20px",
            borderRadius:"0",
            height:"32px",
            // color:"black"
        }}
        searchStyle={{ 
            marginLeft: "0",
            padding:"0",
            // color:"black"
        }}
        inputStyle={{
            width: "75%",
            marginLeft: "50px",
            borderRadius:"0",
            height:"32px",
            textAlign:"left",
            color:"black"

        }}
      />
      {/* value="" onComplete={handleComplete} */}
      {otpsec? (<Box><HStack color="black" mb="3">
         <PinInput size='sm' type="number" placeholder="•" onChange={(e)=> setOTP(e)} >
              <PinInputField  />
              <PinInputField  />
              <PinInputField  />
              <PinInputField  />
              <PinInputField  />
              <PinInputField  />
         </PinInput>
         </HStack>
         <Button onClick={ checkotp } borderRadius="0" mb="-5px" pt="18px" pr="82px" pb="18px" pl="82px" size="sm" bg="red.400" fontSize="sm">
          Verify OTP
        </Button>
         </Box>):(<Box></Box>)
      }
        
        <Button onClick={ handleSubmit } borderRadius="0" mb="-5px" pt="18px" pr="90px" pb="18px" pl="90px" size="sm" bg="red.400" fontSize="sm">
          Get OTP
        </Button>
        
        <Link to="/Login">
        <Button  borderRadius="0" mb="-5px" pt="18px" pr="60px" pb="18px" bg="whiteAlpha.100" fontSize="sm" border="1px solid rgba(0, 0, 0, 0.10)" color="black" pl="60px" size="sm">
           Email Login
        </Button>
        </Link>
        <Button onClick={ handleGooglelogin }  borderRadius="0" mb="25px" pt="18px" pr="75px" pb="18px" bg="whiteAlpha.100" fontSize="sm" border="1px solid rgba(0, 0, 0, 0.10)" color="black" pl="75px" size="sm" leftIcon={< FcGoogle />}>
            Google
        </Button>
        </Box>
        </Flex>
        </Box>
        </Grid>
    {/* </Box>
    </Flex> */}
    <div id="sign-in-button" />
    <div>{name}</div> 
  </div>
//   </ChakraProvider>
  )
}

export default PhoneLogin