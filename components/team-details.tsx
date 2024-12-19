"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teamSchema, type TeamFormData } from "@/lib/validations/team";
import { updateTeam, deleteTeam } from "@/lib/actions/team";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ExternalLink, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

interface TeamDetailsProps {
  team: any;
  onTeamUpdated: () => void;
  onTeamDeleted: () => void;
}

export function TeamDetails({
  team,
  onTeamUpdated,
  onTeamDeleted,
}: TeamDetailsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      teamName: team.team_name,
      techStack: team.tech_stack,
      pitchDeckUrl: team.pitch_deck_url || "",
      leaderName: team.leader_name,
      leaderGithub: team.leader_github,
      member1Name: team.member1_name,
      member1Github: team.member1_github,
      member2Name: team.member2_name,
      member2Github: team.member2_github,
    },
  });

  const onSubmit = async (data: TeamFormData) => {
    setIsSubmitting(true);
    try {
      const result = await updateTeam(team.id, data);
      if (result.success) {
        toast.success("Team updated successfully");
        setIsEditing(false);
        onTeamUpdated();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to update team");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const result = await deleteTeam(team.id);
      if (result.success) {
        toast.success("Team deleted successfully");
        onTeamDeleted();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to delete team");
    }
  };

  if (!isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {team.team_name}
            </h2>
            <p className="text-gray-500 mt-1">{team.tech_stack}</p>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Team</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this team? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="space-y-6">
          {team.pitch_deck_url && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Pitch Deck</h3>
              <a
                href={team.pitch_deck_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
              >
                View Pitch Deck
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-500">Team Leader</h3>
            <p className="mt-1">{team.leader_name}</p>
            <a
              href={`https://github.com/${team.leader_github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
            >
              {team.leader_github}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Team Member 1
              </h3>
              <p className="mt-1">{team.member1_name}</p>
              <a
                href={`https://github.com/${team.member1_github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
              >
                {team.member1_github}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Team Member 2
              </h3>
              <p className="mt-1">{team.member2_name}</p>
              <a
                href={`https://github.com/${team.member2_github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
              >
                {team.member2_github}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {team.mentor_name && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Assigned Mentor
              </h3>
              <p className="mt-1">{team.mentor_name}</p>
            </div>
          )}
          <div className="text-sm font-medium text-gray-500">
            GitHub Repository
            <a
              href={team.github_link ?? ""}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
            >
              {team.team_name}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="teamName">Team Name</Label>
          <Input
            id="teamName"
            {...register("teamName")}
            className={errors.teamName ? "border-red-500" : ""}
          />
          {errors.teamName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.teamName.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="pitchDeckUrl">Pitch Deck URL</Label>
          <Input
            id="pitchDeckUrl"
            type="url"
            {...register("pitchDeckUrl")}
            className={errors.pitchDeckUrl ? "border-red-500" : ""}
          />
          {errors.pitchDeckUrl && (
            <p className="text-red-500 text-sm mt-1">
              {errors.pitchDeckUrl.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="leaderName">Team Leader Name</Label>
            <Input
              id="leaderName"
              {...register("leaderName")}
              className={errors.leaderName ? "border-red-500" : ""}
            />
            {errors.leaderName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.leaderName.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="leaderGithub">Team Leader GitHub</Label>
            <Input
              id="leaderGithub"
              {...register("leaderGithub")}
              className={errors.leaderGithub ? "border-red-500" : ""}
            />
            {errors.leaderGithub && (
              <p className="text-red-500 text-sm mt-1">
                {errors.leaderGithub.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="member1Name">Team Member 1 Name</Label>
            <Input
              id="member1Name"
              {...register("member1Name")}
              className={errors.member1Name ? "border-red-500" : ""}
            />
            {errors.member1Name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.member1Name.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="member1Github">Team Member 1 GitHub</Label>
            <Input
              id="member1Github"
              {...register("member1Github")}
              className={errors.member1Github ? "border-red-500" : ""}
            />
            {errors.member1Github && (
              <p className="text-red-500 text-sm mt-1">
                {errors.member1Github.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="member2Name">Team Member 2 Name</Label>
            <Input
              id="member2Name"
              {...register("member2Name")}
              className={errors.member2Name ? "border-red-500" : ""}
            />
            {errors.member2Name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.member2Name.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="member2Github">Team Member 2 GitHub</Label>
            <Input
              id="member2Github"
              {...register("member2Github")}
              className={errors.member2Github ? "border-red-500" : ""}
            />
            {errors.member2Github && (
              <p className="text-red-500 text-sm mt-1">
                {errors.member2Github.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsEditing(false);
              reset();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
