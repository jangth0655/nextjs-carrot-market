import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useMutation from "@libs/client/useMutation";

interface EditProfileForm {
  email?: string;
  phone?: string;
  formError?: string;
  name?: string;
  avatar?: FileList;
}

interface EditProfileResponse {
  ok: boolean;
  error?: string;
}

const EditProfile: NextPage = () => {
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<EditProfileForm>();
  const [editProfile, { data, loading }] =
    useMutation<EditProfileResponse>(`/api/users/me`);
  useEffect(() => {
    if (user?.profile.avatar)
      setAvatarPreview(
        `https://imagedelivery.net/h3kJx8b63YkXouCAFpwF5w/${user?.profile.avatar}/avatar`
      );
    if (user?.profile.name) setValue("name", user?.profile?.name);
    if (user?.profile.email) setValue("email", user?.profile?.email);
    if (user?.profile.phone) setValue("phone", user.profile.phone);
  }, [setValue, user]);
  const onValid = async ({ email, phone, name, avatar }: EditProfileForm) => {
    if (loading) return;
    if (email === "" && phone === " " && name === "") {
      return setError("formError", { message: "Email OR phone required" });
    }

    if (avatar && avatar.length > 0 && user?.profile.id) {
      const { uploadURL } = await (await fetch(`/api/files`)).json();
      const form = new FormData();
      form.append("file", avatar[0], user?.profile.id + "");
      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();

      editProfile({
        email,
        phone,
        name,
        avatarId: id,
      });
    } else {
      editProfile({
        email,
        phone,
        name,
      });
    }
  };

  useEffect(() => {
    if (data && !data?.ok) {
      setError("formError", { message: data?.error });
    }
  }, [data, setError]);
  const [avatarPreview, setAvatarPreview] = useState("");

  const avatar = watch("avatar");
  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const file = avatar[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [avatar]);
  return (
    <Layout canGoBack title="Edit Profile">
      <form onSubmit={handleSubmit(onValid)} className="space-y-4 py-10 px-4">
        <div className="flex items-center space-x-3">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              className="h-14 w-14 rounded-full bg-slate-500"
              alt="avatar"
            />
          ) : (
            <div className="h-14 w-14 rounded-full bg-slate-500" />
          )}
          <label
            htmlFor="picture"
            className="cursor-pointer rounded-md border border-gray-300 py-2 px-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Change
            <input
              {...register("avatar")}
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input
          register={register("name")}
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("email")}
          label="Email address"
          name="email"
          type="email"
        />
        <Input
          register={register("phone")}
          label="Phone number"
          name="phone"
          type="number"
          kind="phone"
        />
        {errors.formError ? (
          <span className="my-2 text-red-500 font-bold block text-center">
            {errors.formError.message}
          </span>
        ) : (
          ""
        )}
        <Button loading={loading} text="Update profile" />
      </form>
    </Layout>
  );
};

export default EditProfile;

//
