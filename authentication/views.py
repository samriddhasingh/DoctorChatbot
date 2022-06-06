
from django.shortcuts import render
from django.contrib.auth.models import User
from setuptools import find_namespace_packages
from django.contrib import messages
from django.shortcuts import redirect,render,HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from doctorchatbot import settings
from django.core.mail import send_mail
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes,force_str
from . token import generate_token
from django.core.mail import EmailMessage,send_mail
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse






def appointment(request):
    return render(request,'appointment.html')

def dashboard(request):
    fname=request.GET.get('fname')
    return render(request,'index.html',{'fname':fname})

def signup(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        first_name = request.POST.get('fname')
        second_name = request.POST.get('lname')
        password1 = request.POST.get('pass1')
        password2 = request.POST.get('pass2')
        print(username)
        print(email)
        print(first_name)
        if User.objects.filter(username=username):
            error=1
            return render(request,'signup.html',{'error':error})
        
        if User.objects.filter(email=email):
            error=2
            return render(request,'signup.html',{'error':error})
        
        if password1 != password2:
            error=3
            return render(request,"signup.html",{'error':error})

        if not username.isalnum():
            error=4
            return render(request,"signup.html",{'error':error})
        if len(username)>10:
            error=5
            return render(request,"signup.html",{'error':error})

        myuser=User.objects.create_user(username,email,password1)
        myuser.first_name = first_name
        myuser.last_name =second_name
        myuser.is_active =False
        myuser.save()
        messages.success(request,'Your account has been successfully signed up')

        subject=" Welcome to the DoctorChatbot: Webapp for disease prediction "
        message="Hello " + myuser.first_name+ ". Thank you for visiting our website confirmation link below 👇👇👇"
        from_email=settings.EMAIL_HOST_USER
        
        to_list=[myuser.email]

        send_mail(subject,message,from_email,to_list,fail_silently=True)
      
    

        current_site=get_current_site(request)
        email_subject="confirm your email DoctorChatbot login "
        message2=render_to_string("email_confirmation.html",{
            'name':myuser.first_name,
            'uid':urlsafe_base64_encode(force_bytes(myuser.pk)),
            'domain':current_site.domain,
            'token':generate_token.make_token(myuser)
        })
        email=EmailMessage(
            email_subject,
            message2,
            settings.EMAIL_HOST_USER,
            [myuser.email]
        )
        email.fail_silently=True
        email.send()
        success=True
        return render(request,'signin.html')


    return render(request,'signup.html')


def signin(request):

    if request.method == 'POST':
        username = request.POST.get('username')
        password= request.POST.get('pass1') 

        user=authenticate(username=username, password=password) 
        print(user)
        if user is not None:
            login(request, user)
        
            fname=user.first_name
            url="signin/dashboard/?fname={}".format(user.first_name)
            return redirect(url)

        else:
            messages.error(request,"Not matched")
            return redirect('signin')

    return render(request,'signin.html')

def signout(request):
    logout(request)
    messages.success(request,"Logged out sucessfully")
    return redirect('home')

def activate(request,uidb64,token):
    try:
        uid=force_str(urlsafe_base64_decode(uidb64))
        myuser=User.objects.get(pk=uid)
    except(TypeError, ValueError,OverflowError,User.DoesNotExist):
        myuser=None
    if myuser is not None and generate_token.check_token(myuser,token):
        myuser.is_active= True
        myuser.save()
        login(request,myuser)
    


        return redirect('signin')
    else:
        return render(request,'activation_failed.html')
    

def recommendation(request):
    if request.method == 'POST':
        name=request.POST.get('name')
        date=request.POST.get('date')
        mail = request.POST.get('email')
        to_list=[mail]
        subject="Appointment Registration "
        message="Hello " + name + "Thank you for visiting our website Your Appointment have been registered sucessfully Please be in time in Norvic Hospital. \n You have been referred to Dr.Santosh Shah" + '\n Your due time and date is 10:00 AM '+ date 
        from_email=settings.EMAIL_HOST_USER
        send_mail(subject,message,from_email,to_list,fail_silently=True)
    
    return render(request,'recommendation.html')
